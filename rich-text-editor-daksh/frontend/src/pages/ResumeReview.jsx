import { useState } from 'react'
import axios from '../api/axios'

const ResumeReview = () => {
  const [resumeText, setResumeText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const response = await axios.post('/api/resume/review', {
        resume_text: resumeText
      })
      
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Resume Review</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Paste your resume text below:</label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Enter your resume text here..."
              required
              style={{ minHeight: '200px' }}
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card">
          <h2>Analysis Results</h2>
          
          <div style={{ marginBottom: '20px' }}>
            <h3>Overall Score: {result.score}/100</h3>
            <div style={{ 
              width: '100%', 
              height: '20px', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${result.score}%`,
                height: '100%',
                backgroundColor: result.score >= 70 ? '#4caf50' : result.score >= 50 ? '#ff9800' : '#f44336',
                transition: 'width 0.5s'
              }}></div>
            </div>
          </div>

          {result.feedback.missing_skills && result.feedback.missing_skills.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Missing Skills</h3>
              <ul>
                {result.feedback.missing_skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          )}

          {result.feedback.improvements && result.feedback.improvements.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Suggested Improvements</h3>
              <ul>
                {result.feedback.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          )}

          {result.feedback.better_bullets && result.feedback.better_bullets.length > 0 && (
            <div>
              <h3>Better Bullet Points</h3>
              <ul>
                {result.feedback.better_bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ResumeReview
