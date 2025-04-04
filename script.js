const uploadResume = async () => {
    const fileInput = document.getElementById("resumeUpload");
    const status = document.getElementById("resumeStatus");

    if (!fileInput.files.length) {
        status.innerText = "Please select a file.";
        return;
    }

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);

    status.innerText = "Processing resume...";
    
    try {
        const response = await fetch("http://localhost:5000/api/upload-resume", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        status.innerText = `Resume Processed: ${data.message}`;
    } catch (error) {
        status.innerText = "Error processing resume.";
        console.error(error);
    }
};

const startInterview = async () => {
    const status = document.getElementById("interviewStatus");
    status.innerText = "Interview in progress...";

    try {
        const response = await fetch("http://localhost:5000/api/start-interview");
        const data = await response.json();
        status.innerText = "Interview completed. AI is analyzing...";
    } catch (error) {
        status.innerText = "Interview processing failed.";
        console.error(error);
    }
};

const fetchCandidates = async () => {
    const list = document.getElementById("candidateList");
    list.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch("http://localhost:5000/api/get-candidates");
        const data = await response.json();
        list.innerHTML = data.candidates.map(c => `<li>${c}</li>`).join("");
    } catch (error) {
        list.innerHTML = "<p>Error fetching candidates.</p>";
        console.error(error);
    }
};
