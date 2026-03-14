import { UserRole } from "@prisma/client";
import { prisma } from "../lib/db.js";
import { getLanguageId, pollBatchResults, submitBatch } from "../lib/problem.lib.js";

export const createProblem = async (req, res) => {
    const {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolutions
    } = req.body;

    // Validate required fields
    if (!title || !description || !difficulty || !tags || !examples || !constraints || !testCases || !codeSnippets || !referenceSolutions) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getLanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    error: `Unsupported language: ${language}`
                });
            }

            // Build submissions array for this language
            const submissions = testCases.map((tc) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: tc.input,
                expected_output: tc.output
            }));

            const submissionResults = await submitBatch(submissions);
            const tokens = submissionResults.map((r) => r.token);
            const results = await pollBatchResults(tokens);

            for (let i = 0; i < results.length; i++) {
                const result = results[i];

                if (result.status.id !== 3) {
                    return res.status(400).json({
                        error: `Reference solution failed for ${language} on input: ${submissions[i].stdin}`,
                        details: result
                    });
                }
            }
        }

        // ✅ Fixed: prisma.problem.create (not prisma.create)
        const newProblem = await prisma.problem.create({
            data: {
                title,
                description,
                difficulty,
                tags,
                examples,
                constraints,
                hints,
                editorial,
                testCases,
                codeSnippets,
                referenceSolutions,
                userId: req.user.id
            }
        });

        return res.status(201).json({
            message: "Problem created successfully",
            success: true,
            problem: newProblem
        });

    } catch (error) {
        console.error("Error creating problem:", error);
        return res.status(500).json({
            error: "An error occurred while creating the problem"
        });
    }
};