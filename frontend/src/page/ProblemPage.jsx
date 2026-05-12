import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play, FileText, MessageSquare, Lightbulb, Bookmark,
  Share2, Clock, ChevronRight, Terminal, Code2,
  Users, ThumbsUp, Home,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import SubmissionResults from "../components/Submission.jsx";
import { useSubmissionStore } from "../store/useSubmissionStore.js";
import SubmissionList from "../components/SubmissionList.jsx";



const ProblemPage = () => {
  const { id } = useParams();
  const {
    getProblemByid,
    problem,
    isProblemLoading,
    iseExecuting,
    submission,
    exeCuteCode,
  } = useProblemStore();
  const { submissions, isLoading:isSubmissionsLoading, getAllSubmission, getSubmissionforProblem, submissionCount, getSubmissioncountForProblem } = useSubmissionStore()
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectLanguage, setSelectLanguage] = useState("Javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  

  useEffect(() => {
    getProblemByid(id);
    getSubmissioncountForProblem(id)
  }, [id]);

  useEffect(() => {
    if (!problem) return;
    setCode(problem.codeSnippets?.[selectLanguage] || "");
    const raw = problem.testCases;
    const list = Array.isArray(raw) ? raw : [];
    setTestCases(
      list.map((tc) => ({
        input: tc?.input ?? tc?.stdin ?? "",
        output: tc?.output ?? tc?.expected_output ?? tc?.expectedOutput ?? "",
      }))
    );
  }, [problem, selectLanguage]);

  useEffect(()=>{
    if(activeTab ==="submissions" && id){
      getSubmissioncountForProblem(id)
      getSubmissionforProblem(id)
    }
  },[activeTab, id])
  

  const handelLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectLanguage(lang);
    setCode(problem?.codeSnippets?.[lang] || "");
  };

  //the run code
  const handelrunCode=(e)=>{
    e.preventDefault()
    try {
      const language_id=getLanguageId(selectLanguage)
      const stdin=(problem.testCases ?? []).map((tc)=>tc.input ?? tc.stdin)
      const expected_outputs=testCases.map((tc)=>tc.output)
      exeCuteCode({source_code:code,language_id,stdin,expected_outputs,problemId:id})
    } catch (error) {
      console.log("error in running the code",error);
      
      
    }
  } 

  const renderTab = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none">
            <p className="text-base text-base-content/80 mb-6 leading-relaxed">
              {problem.description}
            </p>

            {problem.examples && (
              <>
                <h3 className="text-lg font-bold mb-4">Examples</h3>
                {Object.entries(problem.examples).map(([lang, example], idx) => (
                  <div key={lang} className="bg-base-200 rounded-xl mb-4 overflow-hidden border border-base-300">
                    <div className="px-4 py-2 bg-base-300 text-xs font-mono text-base-content/50 border-b border-base-300">
                      Example {idx + 1}
                    </div>
                    <div className="p-4 space-y-3 font-mono text-sm">
                      <div>
                        <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wide">Input</span>
                        <div className="mt-1 bg-base-100 px-3 py-2 rounded-lg text-base-content font-semibold">
                          {example.input}
                        </div>
                      </div>
                      <div>
                        <span className="text-indigo-400 font-semibold text-xs uppercase tracking-wide">Output</span>
                        <div className="mt-1 bg-base-100 px-3 py-2 rounded-lg text-base-content font-semibold">
                          {example.output}
                        </div>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wide">Explanation</span>
                          <p className="mt-1 text-base-content/70 font-sans text-sm leading-relaxed">
                            {example.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {problem.constraints && (
              <>
                <h3 className="text-lg font-bold mb-4">Constraints</h3>
                <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                  <span className="font-mono text-sm text-base-content/80">
                    {problem.constraints}
                  </span>
                </div>
              </>
            )}
          </div>
        );

      case "submissions":
        return (
         <SubmissionList problemId={id} submissions={submissions} isLoading={isSubmissionsLoading} />
        );

      case "discussion":
        return (
          <div className="flex flex-col items-center justify-center py-16 text-base-content/30 gap-3">
            <MessageSquare className="w-10 h-10 opacity-20" />
            <p className="text-sm">No discussions yet</p>
          </div>
        );

      case "hints":
        return (
          <div className="flex flex-col items-center justify-center py-16 text-base-content/30 gap-3">
            <Lightbulb className="w-10 h-10 opacity-20" />
            {
              problem?.hints ?(
                <div  className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">{problem.hints}</span></div>
              ):(
                  <div>No hints yet</div>
                )
            }
          </div>
        );

      default:
        return null;
    }
  };

  const showLoading = isProblemLoading || !problem;

  return showLoading ? (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="text-sm text-base-content/40">Loading problem...</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-base-200 w-full">

      {/* Navbar */}
      <nav className="navbar bg-base-100 border-b border-base-300 px-6 sticky top-0 z-50 shadow-sm min-h-12">
        {/* Left */}
        <div className="flex-1 flex items-center gap-2">
          <Link to={"/"} className="flex items-center gap-1.5 text-base-content/40 hover:text-primary transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <ChevronRight className="w-3 h-3 text-base-content/20" />
          <span className="text-sm font-semibold truncate max-w-xs">{problem.title}</span>
          <span className={`badge badge-sm font-semibold text-white ml-1 ${
            problem.difficulty === "EASY" ? "badge-success"
            : problem.difficulty === "MEDIUM" ? "badge-warning"
            : "badge-error"
          }`}>
            {problem.difficulty}
          </span>
        </div>

        {/* Centre — meta */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-base-content/40">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(problem.createdAt).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </span>
          <span className="text-base-content/20">•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {submissionCount} submissions
          </span>
          <span className="text-base-content/20">•</span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            95% success rate
          </span>
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-end gap-1">
          <button onClick={() => setIsBookmarked(!isBookmarked)} className="btn btn-ghost btn-sm btn-circle">
            <Bookmark className={`w-4 h-4 transition-all duration-200 ${isBookmarked ? "fill-primary text-primary" : "text-base-content/50"}`} />
          </button>
          <button className="btn btn-ghost btn-sm btn-circle">
            <Share2 className="w-4 h-4 text-base-content/50" />
          </button>
          <div className="w-px h-5 bg-base-300 mx-1" />
          <select
            value={selectLanguage}
            onChange={handelLanguageChange}
            className="select select-sm select-bordered bg-base-200 font-mono text-xs h-8 min-h-0"
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </nav>

      {/* Main grid */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Left — description card */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered px-2 pt-1">
                {[
                  { id: "description", icon: <FileText className="w-4 h-4" />, label: "Description" },
                  { id: "submissions", icon: <Code2 className="w-4 h-4" />,    label: "Submissions" },
                  { id: "discussion",  icon: <MessageSquare className="w-4 h-4" />, label: "Discussion" },
                  { id: "hints",       icon: <Lightbulb className="w-4 h-4" />, label: "Hints" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    className={`tab gap-2 text-sm ${activeTab === tab.id ? "tab-active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-5 overflow-y-auto max-h-[600px]">
                {renderTab()}
              </div>
            </div>
          </div>

          {/* Right — editor card */}
          <div className="card bg-base-100 shadow-md border border-base-300">
            <div className="card-body p-0">
              <div className="tabs tabs-bordered px-2 pt-1">
                <button className="tab tab-active gap-2 text-sm">
                  <Terminal className="w-4 h-4" />
                  Code Editor
                </button>
              </div>

              <div className="h-[540px] w-full">
                <Editor
                  height="100%"
                  language={selectLanguage?.toLowerCase() || "javascript"}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                  }}
                />
              </div>

              <div className="p-3 border-t border-base-300 bg-base-200 flex justify-between items-center">
                <button className={`btn btn-sm btn-primary gap-2 ${iseExecuting ? "loading":""}`} onClick={handelrunCode} disabled={iseExecuting}>
                  <Play className="w-3 h-3 fill-current" />
                  Run
                </button>
                <button className="btn btn-sm btn-success gap-2">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        {submission?.testCases?.length > 0 && (
          <div className="mt-6">
            <SubmissionResults submission={submission} />
          </div>
        )}

        <div className="card bg-base-100 shadow-md border border-base-300 mt-4">
          <div className="card-body p-4">
            <h3 className="font-bold text-base mb-3">Test Cases</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra table-sm w-full">
                <thead>
                  <tr>
                    <th className="text-xs">Input</th>
                    <th className="text-xs">Expected Output</th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-sm text-base-content/40 py-6">
                        No sample test cases on this problem.
                      </td>
                    </tr>
                  ) : (
                    testCases.map((test, index) => (
                      <tr key={index}>
                        <td className="font-mono text-sm whitespace-pre-wrap">{test.input}</td>
                        <td className="font-mono text-sm whitespace-pre-wrap">{test.output}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProblemPage;