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
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

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

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  if (loading)
    return (
      <div className="center">
        <div className="spinner"></div>
        <p>Loading jobs...</p>
      </div>
    );

  if (error) return <div className="center">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Job Board</h1>
      <input
        type="text"
        placeholder="Search by title or company..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
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
      ) : filteredJobs.length === 0 ? (
        <p className="no-results">No jobs found matching "{search}"</p>
      ) : (
        <>
          <div className="job-list">
            {paginatedJobs.map((job) => (
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

          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;