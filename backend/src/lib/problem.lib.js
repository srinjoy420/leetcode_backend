import axios from "axios"


export function getLanguageId(Language) {
    const languageMap = {
        "PYTHON": 71,
        "JAVASCRIPT": 63,
        "JAVA": 62
    }
    return languageMap[Language.toUpperCase()]

}

//create batch submisson
export async function submitBatch(submissions) {
    const { data } = await axios.post("https://judge029.p.rapidapi.com/submissions/batch", {
        params: {
            base64_encoded: 'true'
        },
        headers: {
            'x-rapidapi-key': '9e5f6ff6bdmsh5fb06b6a7b716f2p124924jsnf820ab5ee113',
            'x-rapidapi-host': 'judge029.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        data: {
            submissions: submissions
        }
    });
    return data; //[{token},{token}]

}
export const sleep=(ms)=>new Promise((resolve)=>setTimeout(resolve,ms))

export async function pollBatchResults(tokens) {
    while (true) {
        const { data } = await axios.get("https://judge029.p.rapidapi.com/submissions/batch", {
            params: {
                tokens: tokens.join(","),
                base64_encoded: 'true',
                fields: '*'
            },
            headers: {
                'x-rapidapi-key': '9e5f6ff6bdmsh5fb06b6a7b716f2p124924jsnf820ab5ee113',
                'x-rapidapi-host': 'judge029.p.rapidapi.com',
                'Content-Type': 'application/json'
            },


        })
        const results=data.submissions;
        //when we hit 3 or >3 then we can stop
        const isAllDone=results.every((r)=>r.status.id!==1 && r.status.id!==2)

        if(isAllDone) return results;
        await sleep(1000) //wait for 1 second before next poll
    }

}

