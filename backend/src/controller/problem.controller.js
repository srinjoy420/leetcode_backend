import { UserRole } from "@prisma/client"
import { prisma } from "../lib/db.js";
import { getLanguageId, pollBatchResults, submitBatch } from "../lib/problem.lib.js";




export const createproblem = (async (req, res) => {
    const { title,
        description,
        difficulty
        , tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolutions
    } = req.body;
    if (!title || !description || !difficulty || !tags || !examples || !constraints || !hints || !editorial || !testCases || !codeSnippets || !referenceSolutions) {
        return res.status(400).json({ "message": "please fill the credentials" })
    }

    if (req.user.role != UserRole.ADMIN) {
        return res.status(401).json({ error: "unauthorized" })
    }
    try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) { //nested array
            const languageId = getLanguageId(language)
            if (!languageId) {
                return res.status(400).json({
                    error: `unsopported language :${language}`
                })
            }
            //testcases
            const submissions = testCases.map((tc) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: tc.input,
                expected_output: tc.output
            }))

            const submissonResults=await submitBatch(submissions)

            const tokens=submissonResults.map((res)=>res.token)
            const results=await pollBatchResults(tokens)

            for(let i=0;i<results.length;i++){
                const result=results[i]

                if(result.status.id !==3){
                    //send  user a array
                    return res.status(400).json({
                        error:`reference solution failed for ${language} on input ${submissions[i].stdin}
                        `,details:result
                    })

                }
            }

        }
        const newProblem=await prisma.create({
            data:{
                title,
                description,
        difficulty
        , tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        userId:req.user.id,
        
            }
        })

        res.status(201).json({
            message:"problem created successfully",
            sucess:true,
            problem:newProblem
        })

    } catch (error) {
        console.log("error in creating a problem ");
        res.status(500).json({
            error:"some error occured while creating a problem"            
        })
        

    }
})

