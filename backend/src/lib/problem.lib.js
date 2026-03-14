import axios from "axios";

const JUDGE0_API_KEY = "9e5f6ff6bdmsh5fb06b6a7b716f2p124924jsnf820ab5ee113";
const JUDGE0_BASE_URL = "https://judge029.p.rapidapi.com";
const JUDGE0_HEADERS = {
    "x-rapidapi-key": JUDGE0_API_KEY,
    "x-rapidapi-host": "judge029.p.rapidapi.com",
    "Content-Type": "application/json"
};

export function getLanguageId(language) {
    const languageMap = {
        PYTHON: 71,
        JAVASCRIPT: 63,
        JAVA: 62
    };
    return languageMap[language.toUpperCase()];
}

// ✅ Fixed: body is 2nd arg, config (params + headers) is 3rd arg
export async function submitBatch(submissions) {
    const { data } = await axios.post(
        `${JUDGE0_BASE_URL}/submissions/batch`,
        { submissions },
        {
            params: { base64_encoded: "false" },
            headers: JUDGE0_HEADERS
        }
    );
    return data; // [{ token }, { token }, ...]
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function pollBatchResults(tokens) {
    while (true) {
        const { data } = await axios.get(
            `${JUDGE0_BASE_URL}/submissions/batch`,
            {
                params: {
                    tokens: tokens.join(","),
                    base64_encoded: "false",
                    fields: "*"
                },
                headers: JUDGE0_HEADERS
            }
        );

        const results = data.submissions;

        // Status id 1 = In Queue, 2 = Processing — keep polling until done
        const isAllDone = results.every((r) => r.status.id !== 1 && r.status.id !== 2);

        if (isAllDone) return results;

        await sleep(1000);
    }
}