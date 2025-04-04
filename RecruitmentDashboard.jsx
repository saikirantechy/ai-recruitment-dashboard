import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Mic, Users } from "lucide-react";

export default function RecruitmentDashboard() {
  const [resume, setResume] = useState(null);
  const [resumeName, setResumeName] = useState("");
  const [interviewActive, setInterviewActive] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Resume Upload Handler
  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
      setResumeName(file.name);
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      try {
        const response = await fetch("http://localhost:5000/api/upload-resume", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to process resume");
        const result = await response.json();
        console.log("✅ Resume processed:", result);
      } catch (error) {
        console.error("❌ Error processing resume:", error.message);
      } finally {
        setUploading(false);
      }
    }
  };

  // AI Interview Start Handler
  const startInterview = async () => {
    setInterviewActive(true);
    try {
      const response = await fetch("http://localhost:5000/api/start-interview", { method: "POST" });
      if (!response.ok) throw new Error("Failed to start interview");
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("❌ Interview processing failed:", error.message);
    } finally {
      setInterviewActive(false);
    }
  };

  // Fetch Candidate Recommendations
  const fetchCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const response = await fetch("http://localhost:5000/api/get-candidates");
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const data = await response.json();
      setCandidates(data.candidates);
    } catch (error) {
      console.error("❌ Error fetching candidates:", error.message);
    } finally {
      setLoadingCandidates(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">AI Recruitment Dashboard</h1>

      {/* Resume Upload */}
      <Card className="w-96 p-4 flex flex-col items-center">
        <h2 className="text-xl font-semibold">Upload Resume</h2>
        <Input type="file" onChange={handleResumeUpload} className="mt-2" disabled={uploading} />
        {resumeName && <p className="mt-2 text-gray-600">Uploaded: {resumeName}</p>}
        {uploading && <p className="text-blue-500 mt-2">Processing resume...</p>}
      </Card>

      {/* AI Interview */}
      <Card className="w-96 p-4 flex flex-col items-center">
        <h2 className="text-xl font-semibold">AI Interview</h2>
        <Button className="mt-4 flex gap-2" onClick={startInterview} disabled={interviewActive}>
          <Mic size={18} /> {interviewActive ? "Interview in Progress..." : "Start Interview"}
        </Button>
      </Card>

      {/* Candidate Recommendations */}
      <Card className="w-96 p-4 flex flex-col items-center">
        <h2 className="text-xl font-semibold">Candidate Recommendations</h2>
        <Button className="mt-4 flex gap-2" onClick={fetchCandidates} disabled={loadingCandidates}>
          <Users size={18} /> {loadingCandidates ? "Loading..." : "View Candidates"}
        </Button>
        <ul className="mt-2">
          {candidates.length > 0 ? candidates.map((candidate, index) => (
            <li key={index} className="text-green-500">{candidate.name} (Score: {candidate.interviewScore})</li>
          )) : <p className="text-gray-500">No candidates available</p>}
        </ul>
      </Card>
    </div>
  );
}
