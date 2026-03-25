<!-- the backend flow -->
<!-- creating the problem -->
You have **two files working together**:

1. **Problem Controller** → creates a coding problem and validates the reference solutions using Judge0.
2. **Judge0 Utility Library** → communicates with the Judge0 API to run code against test cases.

I'll explain them **side-by-side and step-by-step**, including **why each line exists** and **how the flow works**.

---

# 1️⃣ High Level Flow (Both Files Together)

```
Admin sends request → createProblem()

1. Extract problem data from request
2. Validate required fields
3. For each reference solution language
      ↓
      getLanguageId()
      ↓
      Build submissions for Judge0
      ↓
      submitBatch()
      ↓
      Judge0 returns tokens
      ↓
      pollBatchResults()
      ↓
      Wait until execution finished
      ↓
      Verify every test case passed

4. If all passed → save problem in DB
5. Return success response
```

So the **controller uses functions from the library**.

---

# 2️⃣ File 1: `createProblem Controller`

### Imports

```javascript
import { UserRole } from "@prisma/client";
import { prisma } from "../lib/db.js";
import { getLanguageId, pollBatchResults, submitBatch } from "../lib/problem.lib.js";
```

### What happens here

| Import             | Purpose                            |
| ------------------ | ---------------------------------- |
| `UserRole`         | role system (admin/user)           |
| `prisma`           | database ORM                       |
| `getLanguageId`    | converts language name → Judge0 ID |
| `submitBatch`      | sends code to Judge0               |
| `pollBatchResults` | keeps checking result              |

---

# 3️⃣ Controller Function

```javascript
export const createProblem = async (req, res) => {
```

This function is called when **admin creates a new coding problem**.

Example route:

```
POST /api/problems
```

---

# 4️⃣ Extract Data from Request

```javascript
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
```

This extracts all problem fields.

Example request body:

```json
{
 "title":"Two Sum",
 "difficulty":"Easy",
 "testCases":[
  {"input":"2 7 11 15\n9","output":"0 1"}
 ],
 "referenceSolutions":{
   "javascript":"function twoSum(){}",
   "python":"def twoSum():"
 }
}
```

---

# 5️⃣ Validate Required Fields

```javascript
if (!title || !description || !difficulty || !tags || !examples || !constraints || !testCases || !codeSnippets || !referenceSolutions)
```

If something missing → return error.

Response:

```json
{
 "message":"Please fill all required fields"
}
```

---

# 6️⃣ Loop Through Reference Solutions

```javascript
for (const [language, solutionCode] of Object.entries(referenceSolutions))
```

Example `referenceSolutions`:

```
{
  JAVASCRIPT: "...",
  PYTHON: "..."
}
```

This loop becomes:

```
Iteration 1:
language = JAVASCRIPT
solutionCode = JS code

Iteration 2:
language = PYTHON
solutionCode = Python code
```

Why?

Because **we must validate each language solution**.

---

# 7️⃣ Get Judge0 Language ID

```javascript
const languageId = getLanguageId(language);
```

Now the **second file is used**.

Inside library:

```
JAVASCRIPT → 63
PYTHON → 71
JAVA → 62
```

Judge0 needs numbers, not names.

---

# 8️⃣ Check Unsupported Language

```javascript
if (!languageId)
```

Example:

```
referenceSolutions:
{
 RUST: "..."
}
```

Rust not supported → return error.

---

# 9️⃣ Build Judge0 Submissions

```javascript
const submissions = testCases.map((tc) => ({
 source_code: solutionCode,
 language_id: languageId,
 stdin: tc.input,
 expected_output: tc.output
}));
```

Example testCases:

```
[
 {input:"2 3", output:"5"},
 {input:"10 5", output:"15"}
]
```

Generated submissions:

```
[
 {
  source_code: solutionCode
  language_id: 63
  stdin: "2 3"
  expected_output: "5"
 },
 {
  source_code: solutionCode
  language_id: 63
  stdin: "10 5"
  expected_output: "15"
 }
]
```

So **one submission per test case**.

---

# 🔟 Send Code to Judge0

```javascript
const submissionResults = await submitBatch(submissions);
```

Now second file function executes.

Judge0 response:

```
[
 { token: "abc123" },
 { token: "xyz789" }
]
```

Each token represents **a running program**.

---

# 11️⃣ Extract Tokens

```javascript
const tokens = submissionResults.map((r) => r.token);
```

Result:

```
["abc123","xyz789"]
```

---

# 12️⃣ Poll Execution Results

```javascript
const results = await pollBatchResults(tokens);
```

Judge0 might take **1–3 seconds**.

So polling keeps asking:

```
GET /submissions/batch?tokens=abc123,xyz789
```

Until finished.

---

# 13️⃣ Validate Execution Results

```javascript
for (let i = 0; i < results.length; i++)
```

Check each test case.

Judge0 status codes:

| ID | Meaning           |
| -- | ----------------- |
| 1  | In queue          |
| 2  | Processing        |
| 3  | Accepted          |
| 4  | Wrong answer      |
| 6  | Compilation error |

---

### Pass Check

```javascript
if (result.status.id !== 3)
```

If not accepted → fail.

Example response:

```
{
 error:"Reference solution failed for PYTHON"
}
```

This prevents **wrong problems from being added**.

---

# 14️⃣ Save Problem in Database

```javascript
const newProblem = await prisma.problem.create({
 data:{
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
```

Now the problem is saved.

Database record example:

```
Problem
---------
id
title
description
difficulty
testCases
referenceSolutions
userId
```

---

# 15️⃣ Success Response

```javascript
return res.status(201).json({
 message: "Problem created successfully",
 success: true,
 problem: newProblem
});
```

---

# 2️⃣ Second File: Judge0 Library

This file handles **all Judge0 communication**.

---

# 1️⃣ Import Axios

```javascript
import axios from "axios";
```

Axios is used to call APIs.

---

# 2️⃣ API Configuration

```javascript
const JUDGE0_API_KEY
const JUDGE0_BASE_URL
const JUDGE0_HEADERS
```

These define:

| Variable | Purpose         |
| -------- | --------------- |
| API_KEY  | authentication  |
| BASE_URL | Judge0 server   |
| HEADERS  | request headers |

---

# 3️⃣ Language Mapper

```javascript
export function getLanguageId(language)
```

Map language → Judge0 ID.

```
PYTHON → 71
JAVASCRIPT → 63
JAVA → 62
```

Judge0 only accepts numeric IDs.

---

# 4️⃣ Submit Batch Function

```javascript
export async function submitBatch(submissions)
```

Purpose:

Send **multiple programs to Judge0 at once**.

---

### API Call

```javascript
axios.post(
 `${JUDGE0_BASE_URL}/submissions/batch`,
 { submissions },
 {
  params:{ base64_encoded:"false"},
  headers:JUDGE0_HEADERS
 }
)
```

Request body example:

```
{
 submissions:[
   {source_code:"...",stdin:"2 3"},
   {source_code:"...",stdin:"10 5"}
 ]
}
```

Judge0 response:

```
[
 {token:"abc"},
 {token:"def"}
]
```

---

# 5️⃣ Sleep Function

```javascript
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
```

Used for **delays**.

Example:

```
await sleep(1000)
```

Wait 1 second.

---

# 6️⃣ Poll Batch Results

```javascript
export async function pollBatchResults(tokens)
```

Purpose:

Wait until code execution finishes.

---

### Infinite Loop

```javascript
while (true)
```

Keep checking results.

---

### GET Request

```javascript
axios.get(
 `${JUDGE0_BASE_URL}/submissions/batch`,
```

Params:

```
tokens=abc,def
fields=*
```

Response:

```
{
 submissions:[
   {
     stdout:"5",
     status:{id:3}
   }
 ]
}
```

---

### Check if Finished

```javascript
const isAllDone = results.every(
 r => r.status.id !== 1 && r.status.id !== 2
)
```

Meaning:

```
not queued
not processing
```

Then execution finished.

---

### If Not Done

```javascript
await sleep(1000)
```

Wait 1 second and check again.

---

# 3️⃣ Full Flow Example

Admin creates problem:

```
POST /problems
```

Steps:

```
Controller receives request
↓
Extract problem data
↓
Loop reference solutions
↓
Build Judge0 submissions
↓
submitBatch()
↓
Judge0 returns tokens
↓
pollBatchResults()
↓
Verify outputs
↓
Save problem to DB
↓
Return success
```

---

# 4️⃣ Why This System Is Powerful

This is exactly how platforms like:

* LeetCode
* HackerRank
* CodeChef

validate problems.

Benefits:

✔ ensures reference solution works
✔ prevents wrong problems
✔ supports multiple languages
✔ automated verification

---

# 5️⃣ Architecture Visualization

```
Client
   │
   ▼
Controller
(createProblem)
   │
   ▼
Judge0 Library
(submitBatch)
   │
   ▼
Judge0 API
(run code)
   │
   ▼
pollBatchResults
   │
   ▼
Controller
   │
   ▼
Prisma DB
(save problem)
```

---

✅ If you want, I can also explain:

* **How LeetCode actually stores test cases secretly**
* **How code execution sandbox works**
* **How to build your own Judge (without Judge0)**
* **How LeetCode handles 1M submissions/day**

Those are **very important if you're building a coding platform like your LeetLab project.**

<!-- the execute problem flow -->
1.
Reading the request
const { source_code, language_id, stdin,
  expected_outputs, problemId } = req.body;
const userId = req.user.id;
Six things come in from the request body. req.user.id is set by authMiddleware before this controller runs — you don't read it from the body directly.

what each field means
source_code — the code the user wrote
language_id — 63=JS, 71=Python, 62=Java
stdin — array of test inputs
expected_outputs — array of expected results
problemId — links submission to a problem
userId — from JWT token, not body


2.validate
Input validation
if (!Array.isArray(stdin) || stdin.length === 0
  || !Array.isArray(expected_outputs)
  || expected_outputs.length !== stdin.length) {
  return res.status(400).json({ error: "Invalid or missing test cases!" });
}
Three things checked before doing any real work:

fail stdin is not an array
fail stdin is empty
fail expected_outputs length doesn't match stdin length
pass both are non-empty arrays of the same length
If validation fails, the function returns immediately with a 400. Nothing below runs.

3.Building submission
Building the Judge0 batch
const submissions = stdin.map((input) => ({
  source_code,
  language_id,
  stdin: input,
  base64_encoded: false,
  wait: false
}));
stdin is an array like ["2 7 11 15 9", "3 2 4 6"]. This maps each input into one submission object. Every submission runs the same source code but with a different input. The result is an array of objects ready to send to Judge0.

example — two test cases become two submission objects
[
  { source_code: "...", language_id: 63, stdin: "2 7 11 15
9" },
  { source_code: "...", language_id: 63, stdin: "3 2 4
6" }
]

4.
Sending to Judge0 and waiting
const submitResponse = await submitBatch(submissions);
const tokens = submitResponse.map((r) => r.token);
const results = await pollBatchResults(tokens);
submitBatch()
→
Judge0 queues jobs
→
returns tokens[]
→
pollBatchResults()
→
results[]
submitBatch POSTs all submissions at once. Judge0 returns a token per job — like a ticket number. pollBatchResults loops every 1 second asking "are these done?" until all statuses are no longer 1 (queued) or 2 (running). Then it returns the full results array.

result object shape
{ stdout: "0 1
", stderr: null, status: { id: 3, description: "Accepted" },
  memory: "3124", time: "0.024", compile_output: null }

5.
Checking each test case
let allPassed = true;
const detailResults = results.map((result, i) => {
  const stdout = result.stdout?.trim() ?? null;
  const expected = expected_outputs[i]?.trim() ?? null;
  const passed = stdout === expected;
  if (!passed) allPassed = false;
  return { testCase: i+1, passed, stdout, expected,
           stderr: result.stderr || null,
           compile_output: result.compile_output || null,
           status: result.status.description,
           memory: result.memory ? result.memory+" KB" : null,
           time: result.time ? result.time+" s" : null }
});
For each result, it compares stdout to expected_outputs[i]. The .trim() is critical — Judge0 always adds a trailing newline to stdout, so without trim, "0 1 " === "0 1" would be false even when the answer is correct.

allPassed starts true and flips to false the moment any test case fails.

6.
const submission = await prisma.submission.create({
  data: {
    userId, problemId,
    sourceCode: source_code,
    language: getLanguageName(language_id),
    stdin: stdin.join("\n"),
    stdout: JSON.stringify(detailResults.map(r => r.stdout)),
    stderr: detailResults.some(r => r.stderr)
      ? JSON.stringify(detailResults.map(r => r.stderr)) : null,
    status: allPassed ? "Accepted" : "Wrong Answer",
    memory: ..., time: ..., compileOutput: ...
  }
});
One row in Submission for the whole run. Arrays like stdout/stderr get JSON.stringify-ed because the schema column is String?, not Json. The conditional .some(r => r.stderr) avoids storing ["null","null","null"] when there are no errors — it stores null instead.

status logic
Accepted only if every single test case passed. Otherwise Wrong Answer.

7.
Writing to TestCaseResult table
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
createMany inserts all test case rows in a single DB call — much faster than calling create in a loop. Each row is linked back to the parent submission via submissionId. This is what powers the "test case by test case" breakdown on the frontend.

8.
Marking the problem as solved
if (allPassed) {
  await prisma.problemsolved.upsert({
    where: { userId_problemId: { userId, problemId } },
    update: {},
    create: { userId, problemId }
  });
}
Only runs if every test case passed. Uses upsert instead of create because the Problemsolved model has a @@unique([userId, problemId]) constraint — if you solved it before, create would throw a unique constraint error. upsert says "insert it if it doesn't exist, do nothing if it does".

update: {} — why empty?
The record only has userId, problemId, and timestamps. There's nothing to update if the record already exists — we just want to confirm it's there.

9.

Fetching and returning the full result
const submissionWithTestCases = await prisma.submission.findUnique({
  where: { id: submission.id },
  include: { testCases: true },
});
return res.status(200).json({
  success: true,
  message: "Code executed successfully",
  submission: submissionWithTestCases,
});
Rather than returning the bare submission object, it re-fetches it with include: { testCases: true } so the response includes the individual test case rows nested inside. The frontend gets everything it needs in one response.

the fixed bug here
Original code used db.submission.findUnique — db was never imported. Fixed to prisma.submission.findUnique.

Error handling
catch (error) {
  console.error("Error executing code:", error.message);
  return res.status(500).json({ error: "Failed to execute code" });
}
Catches anything that throws inside the try block — network errors from Judge0, DB errors, unexpected data shapes. Always returns a 500 with a message so the frontend doesn't hang waiting for a response.

10.

--------------------------------------- teh submission --------------------------------
create the submission batches for the all submission releted to the user 