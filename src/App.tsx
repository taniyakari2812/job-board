import { useEffect, useState } from "react";
import "./App.css";

interface Job {
  id: number;
  title: string;
  company_name: string;
  candidate_required_location: string;
  description: string;
  url: string;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetch("https://remotive.com/api/remote-jobs?limit=50")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch jobs");
        return res.json();
      })
      .then((data) => {
        setJobs(data.jobs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="center">Loading jobs...</div>;
  if (error) return <div className="center">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Job Board</h1>
      <input
        type="text"
        placeholder="Search by title or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {selectedJob ? (
        <div className="job-detail">
          <button onClick={() => setSelectedJob(null)}>&larr; Back</button>
          <h2>{selectedJob.title}</h2>
          <p>
            <strong>{selectedJob.company_name}</strong> —{" "}
            {selectedJob.candidate_required_location}
          </p>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: selectedJob.description }}
          />
          <a href={selectedJob.url} target="_blank" rel="noreferrer">
            Apply here
          </a>
        </div>
      ) : (
        <div className="job-list">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => setSelectedJob(job)}
            >
              <h3>{job.title}</h3>
              <p>{job.company_name}</p>
              <p className="location">{job.candidate_required_location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;