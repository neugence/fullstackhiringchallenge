import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'

const Dashboard = () => {
  const [reviews, setReviews] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [reviewsRes, matchesRes] = await Promise.all([
        axios.get('/api/resume/history'),
        axios.get('/api/job/history')
      ])
      
      setReviews(reviewsRes.data.reviews || [])
      setMatches(matchesRes.data.matches || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <Link to="/resume-review" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>📝 Resume Review</h3>
          <p>Get AI-powered feedback on your resume</p>
        </Link>
        
        <Link to="/job-match" className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3>🎯 Job Match</h3>
          <p>Match your resume against job descriptions</p>
        </Link>
      </div>

      <div className="card" style={{ marginTop: '30px' }}>
        <h2>Recent Resume Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet. <Link to="/resume-review">Create your first review</Link></p>
        ) : (
          <div>
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Score: {review.score}/100</strong></span>
                  <span>{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ marginTop: '5px', color: '#666' }}>{review.resume_preview}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2>Recent Job Matches</h2>
        {matches.length === 0 ? (
          <p>No matches yet. <Link to="/job-match">Create your first match</Link></p>
        ) : (
          <div>
            {matches.slice(0, 5).map((match) => (
              <div key={match.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span><strong>Match: {match.match_score}%</strong></span>
                  <span>{new Date(match.created_at).toLocaleDateString()}</span>
                </div>
                <p style={{ marginTop: '5px', color: '#666' }}>{match.job_preview}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
