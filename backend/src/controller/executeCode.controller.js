import { prisma } from "../lib/db.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../lib/problem.lib.js";

export const executeCode = async (req, res) => {
    const { source_code, language_id, stdin, expected_outputs, problemId } = req.body;
    const userId = req.user.id;

    try {
        // 1. Validate input
        if (!Array.isArray(stdin) || stdin.length === 0 || !Array.isArray(expected_outputs) || expected_outputs.length !== stdin.length) {
            return res.status(400).json({ error: "Invalid or missing test cases!" });
        }

        // 2. Build batch submissions
        const submissions = stdin.map((input) => ({
            source_code,
            language_id,
            stdin: input,
            base64_encoded: false,
            wait: false
        }));

        // 3. Submit to Judge0 and poll for results
        const submitResponse = await submitBatch(submissions);
        const tokens = submitResponse.map((r) => r.token);
        const results = await pollBatchResults(tokens);

        // 4. Compare results against expected outputs
        let allPassed = true;
        const detailResults = results.map((result, i) => {
            const stdout = result.stdout?.trim() ?? null;           
            const expected = expected_outputs[i]?.trim() ?? null;   
            const passed = stdout === expected;

            if (!passed) allPassed = false;

            return {
                testCase: i + 1,
                passed,
                stdout,
                expected,
                stderr: result.stderr || null,
                compile_output: result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : null,
                time: result.time ? `${result.time} s` : null,
            };
        });

        // 5. Save submission to DB
        const submission = await prisma.submission.create({
            data: {
                userId,
                problemId,
                sourceCode: source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: JSON.stringify(detailResults.map((r) => r.stdout)),
                stderr: detailResults.some((r) => r.stderr)
                    ? JSON.stringify(detailResults.map((r) => r.stderr))
                    : null,
                compileOutput: detailResults.some((r) => r.compile_output)
                    ? JSON.stringify(detailResults.map((r) => r.compile_output))
                    : null,
                status: allPassed ? "Accepted" : "Wrong Answer",
                memory: detailResults.some((r) => r.memory)
                    ? JSON.stringify(detailResults.map((r) => r.memory))
                    : null,
                time: detailResults.some((r) => r.time)
                    ? JSON.stringify(detailResults.map((r) => r.time))
                    : null,
            }
        });

        // 6. Save individual test case results
        await prisma.testCaseResult.createMany({
            data: detailResults.map((result) => ({
                submissionId: submission.id,
                testCase: result.testCase,
                passed: result.passed,
                stdout: result.stdout,
                expected: result.expected,
                stderr: result.stderr,
                compileOutput: result.compile_output,
                status: result.status,
                memory: result.memory,
                time: result.time,
            }))
        });

        // 7.  Mark problem as solved if all passed
        if (allPassed) {
            await prisma.problemsolved.upsert({
                where: { userId_problemId: { userId, problemId } },
                update: {},
                create: { userId, problemId }
            });
        }

        // 8.  Fixed: prisma not db
        const submissionWithTestCases = await prisma.submission.findUnique({
            where: { id: submission.id },
            include: { testCases: true },
        });

        return res.status(200).json({
            success: true,
            message: "Code executed successfully",
            submission: submissionWithTestCases,
        });

    } catch (error) {
        console.error("Error executing code:", error.message);
        return res.status(500).json({ error: "Failed to execute code" });
    }
};