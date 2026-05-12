import React, { useEffect } from "react";
import { useSubmissionStore } from "../store/useSubmissionStore";

const SubmissionList = ({ problemId, submissions: submissionsProp, isLoading: isLoadingProp }) => {
  const { submissions: submissionsStore, isLoading: isLoadingStore, getSubmissionforProblem } = useSubmissionStore();

  const submissions = submissionsProp ?? submissionsStore;
  const isLoading = isLoadingProp ?? isLoadingStore;

  useEffect(() => {
    if (problemId) getSubmissionforProblem(problemId);
  }, [problemId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-base-content/40">
        <span className="loading loading-spinner loading-md text-primary" />
      </div>
    );
  }

  if (!Array.isArray(submissions) || submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-base-content/40 gap-2">
        <p className="text-sm">No submissions yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra table-sm w-full">
        <thead>
          <tr>
            <th className="text-xs">When</th>
            <th className="text-xs">Status</th>
            <th className="text-xs">Language</th>
            <th className="text-xs">Time</th>
            <th className="text-xs">Memory</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => (
            <tr key={s.id}>
              <td className="text-xs text-base-content/60">
                {s.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}
              </td>
              <td className={`text-xs font-semibold ${s.status === "Accepted" ? "text-success" : "text-error"}`}>
                {s.status ?? "-"}
              </td>
              <td className="text-xs font-mono">{s.language ?? "-"}</td>
              <td className="text-xs">{s.time ? safeFirst(s.time) : "-"}</td>
              <td className="text-xs">{s.memory ? safeFirst(s.memory) : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function safeFirst(value) {
  // backend stores time/memory as JSON string arrays
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed[0] ?? "-";
    } catch {
      // ignore
    }
    return value;
  }
  if (Array.isArray(value)) return value[0] ?? "-";
  return value ?? "-";
}

export default SubmissionList;