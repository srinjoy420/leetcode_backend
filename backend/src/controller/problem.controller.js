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
            //it makes like obejct like structure
            // runs the loop once for each language
            const languageId = getLanguageId(language);

            if (!languageId) {
                return res.status(400).json({
                    error: `Unsupported language: ${language}`
                });
            }

            // Build submissions array for this language
            //one submission for each test case
            const submissions = testCases.map((tc) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: tc.input,
                expected_output: tc.output
            }));

            const submissionResults = await submitBatch(submissions);
            //extract tokens exapmple ["abc123","xyz789"]
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

export const getallProblems = async (req, res) => {
    const problems = await prisma.problem.findMany()
    try {
        if (!problems || problems.length === 0) {
            return res.status(400).json({ message: "there is no problem" })
        }
        res.status(200).json({ success: true, message: "the problems fetched succesfully", problems })
    } catch (error) {
        console.log("error in fetching all problems", error);
        res.status(404).json({ success: false, message: "the problems cant fetched succesfully" })


    }
}

export const getProblemById = async (req, res) => {
    const { id } = req.params
    try {
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "the id is required",

            })
        }
        const problem = await prisma.problem.findUnique({
            where: {
                id: id
            }
        })
        if (!problem) {
            return res.status(400).json({
                success: false,
                message: "the problem cant find"
            })
        }
        res.status(200).json({
            message: "the problem found succesfully",
            succcess: true,
            problem
        })
    } catch (error) {
        console.log("there is a error in finding a problem", error);
        res.status(400).json({
            message: "the problem not found succesfully",
            succcess: false,

        })



    }
}

export const updateProblem = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Problem ID is required" });
    }

    const {
        title, description, difficulty, tags, examples,
        constraints, hints, editorial, testCases,
        codeSnippets, referenceSolutions
    } = req.body;

    if (!title || !description || !difficulty || !tags || !examples || !constraints || !testCases || !codeSnippets || !referenceSolutions) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    try {
        const problem = await prisma.problem.findUnique({ where: { id } });

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" }); // ✅ return added
        }

        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
            const languageId = getLanguageId(language);

            if (!languageId) {
                return res.status(400).json({ error: `Unsupported language: ${language}` });
            }

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
                if (results[i].status.id !== 3) {
                    return res.status(400).json({
                        error: `Reference solution failed for ${language} on input: ${submissions[i].stdin}`,
                        details: results[i]
                    });
                }
            } // ✅ loop ends here — no DB call inside
        }

        // ✅ update is outside both loops, has where clause, no userId
        const updatedProblem = await prisma.problem.update({
            where: { id },
            data: {
                title, description, difficulty, tags,
                examples, constraints, hints, editorial,
                testCases, codeSnippets, referenceSolutions
            }
        });

        return res.status(200).json({ // ✅ 200 not 201
            message: "Problem updated successfully",
            success: true,
            problem: updatedProblem
        });

    } catch (error) {
        console.error("Error updating problem:", error);
        return res.status(500).json({ error: "An error occurred while updating the problem" });
    }
};
export const deleteProblem = async (req, res) => {
    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: "the id is required" })
    }
    try {
        const problem = await prisma.problem.findUnique({
            where: {
                id: id
            }
        })
        if (!problem) {
            return res.status(400).json({ message: "user founed succesfully" })
        }
        await prisma.problem.delete({
            where: {
                id
            }
        })
        res.status(200).json({ message: "the problem deleted succesfully" })
    } catch (error) {
        console.error("Error deleting problem:", error);
        return res.status(500).json({ error: "An error occurred while deleting  the problem" });

    }
}

export const getallProblemssolvedByUser = async (req, res) => {
    try {
        const problems = await prisma.problem.findMany({
            where: {
                solveBy: { //means — "at least one record in solveBy matches this condition"
                    some: {  //So this says: "return problems where at least one entry in solveBy belongs to the logged-in user"
                        userId: req.user.id
                    }
                }

            },
            include: { //include: { solveBy } says: also attach the solveBy records to each problem
                solveBy: {
                    where: { //The inner where filters it down to only the current user's solve record — otherwise you'd get every user's solve entry for that problem, which is unnecessary
                        userId: req.user.id
                    }
                }
            }

        })
        res.status(200).json({ success: true, message: "the problems solved by user fetched succesfully", problems })
    } catch (error) {
        console.error("Error fetching problems solved by user:", error);
        return res.status(500).json({ error: "An error occurred while fetching problems solved by user" });

    }
}
export const searchProblem=async(req,res)=>{
    const userId=req.user.id;
    if(!userId){
        return res.status(404).json({message:"user not found"});
    }
    try {
        const where={}
        if(req.query.difficulty){
            where.difficulty=req.query.difficulty;
        }
        if(req.query.tags){
            where.tags={has:req.query.tags};

        }
        if(req.query.title){
            where.title={contains:req.query.title,mode:"insensitive"};
        }
        const problems=await prisma.problem.findMany({
            where
           
        })
        res.status(200).json({success:true,message:"the problem fetched succesfully",problems})


    } catch (error) {
        console.log("the problem fetched have some problem",error);
        res.status(400).json({message:"the problem fetched have some problem",success:false})
        
        
    }

}