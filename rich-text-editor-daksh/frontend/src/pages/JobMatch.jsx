import { useState } from 'react'
import axios from '../api/axios'

const JobMatch = () => {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await axios.post('/api/job/match', {
        resume_text: resumeText,
        job_description: jobDescription
      })
      
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to match job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Job Match</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Resume:</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              required
              style={{ minHeight: '150px' }}
            />
          </div>
          
          <div className="form-group">
            <label>Job Description:</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              required
              style={{ minHeight: '150px' }}
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing Match...' : 'Analyze Match'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card">
          <h2>Match Results</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Match Score: {result.match_score}%</h3>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${result.match_score}%`,
                height: '100%',
                backgroundColor: result.match_score >= 70 ? '#4caf50' : result.match_score >= 50 ? '#ff9800' : '#f44336',
                transition: 'width 0.5s'
              }}></div>
            </div>
          </div>

          {result.missing_keywords && result.missing_keywords.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Missing Keywords</h3>
              <ul>
                {result.missing_keywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          )}

          {result.recommendations && result.recommendations.length > 0 && (
            <div>
              <h3>Recommendations</h3>
              <ul>
                {result.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobMatch
