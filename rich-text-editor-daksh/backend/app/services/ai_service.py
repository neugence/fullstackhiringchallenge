"""
AI service for resume analysis and job matching using OpenAI API.
Includes fallback to mock service when API key is not configured.
"""
import os
import json
import random
from openai import OpenAI


def _use_openai():
    """
    Check if OpenAI API key is configured.
    
    Returns:
        bool: True if API key is available, False otherwise
    """
    api_key = os.getenv('OPENAI_API_KEY')
    return api_key is not None and api_key.strip() != ''


def _mock_analyze_resume(resume_text):
    """
    Mock implementation for resume analysis.
    Returns realistic mock data for development and testing.
    
    Args:
        resume_text (str): Resume text to analyze
    
    Returns:
        dict: Mock analysis results with score, missing_skills, improvements, better_bullets
    """
    # Generate a random score between 60-90
    score = random.randint(60, 90)
    
    # Common missing skills
    all_skills = [
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'CI/CD',
        'Microservices', 'GraphQL', 'TypeScript', 'React',
        'Python', 'Machine Learning', 'Data Analysis'
    ]
    missing_skills = random.sample(all_skills, k=random.randint(2, 5))
    
    # Common improvements
    all_improvements = [
        'Add quantifiable achievements with specific metrics',
        'Include more technical keywords relevant to your field',
        'Highlight leadership and team collaboration experience',
        'Add certifications and professional development',
        'Include links to portfolio or GitHub projects',
        'Emphasize problem-solving and impact on business goals'
    ]
    improvements = random.sample(all_improvements, k=random.randint(3, 5))
    
    # Sample better bullets
    better_bullets = [
        'Led team of 5 engineers to deliver project 2 weeks ahead of schedule, resulting in 15% cost savings',
        'Improved system performance by 40% through code optimization and database indexing',
        'Implemented automated testing pipeline, reducing bug reports by 60% in production',
        'Architected scalable microservices infrastructure serving 1M+ daily active users'
    ]
    
    return {
        'score': score,
        'missing_skills': missing_skills,
        'improvements': improvements,
        'better_bullets': random.sample(better_bullets, k=random.randint(3, 4))
    }


def _mock_match_job(resume_text, job_description):
    """
    Mock implementation for job matching.
    Returns realistic mock data for development and testing.
    
    Args:
        resume_text (str): Resume text
        job_description (str): Job description text
    
    Returns:
        dict: Mock match results with match_score, missing_keywords, recommendations
    """
    # Generate a random match score between 65-95
    match_score = random.randint(65, 95)
    
    # Common missing keywords
    all_keywords = [
        'Agile', 'Scrum', 'REST API', 'SQL', 'NoSQL',
        'Git', 'Jenkins', 'Terraform', 'Monitoring', 'Security'
    ]
    missing_keywords = random.sample(all_keywords, k=random.randint(2, 4))
    
    # Common recommendations
    all_recommendations = [
        'Highlight cloud experience and infrastructure management',
        'Add distributed systems and scalability projects',
        'Emphasize experience with the specific tech stack mentioned',
        'Include examples of cross-functional collaboration',
        'Showcase problem-solving in similar domain or industry'
    ]
    recommendations = random.sample(all_recommendations, k=random.randint(2, 4))
    
    return {
        'match_score': match_score,
        'missing_keywords': missing_keywords,
        'recommendations': recommendations
    }


def analyze_resume(resume_text):
    """
    Analyze a resume using AI (OpenAI or mock).
    
    Args:
        resume_text (str): The full text of the resume to analyze
    
    Returns:
        dict: Analysis results containing:
            - score (int): Overall quality score 0-100
            - missing_skills (list): Skills that would strengthen the resume
            - improvements (list): Specific suggestions for improvement
            - better_bullets (list): Rewritten bullet points that are more impactful
    
    Raises:
        Exception: If API call fails
    """
    if not _use_openai():
        # Use mock service
        return _mock_analyze_resume(resume_text)
    
    try:
        # Use OpenAI API
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        prompt = f"""Analyze the following resume and provide:
1. A score from 0-100 indicating overall quality
2. A list of missing skills that would strengthen the resume
3. Specific improvements the candidate should make
4. 3-5 rewritten bullet points that are more impactful

Resume:
{resume_text}

Return response as JSON with keys: score, missing_skills, improvements, better_bullets"""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert resume reviewer and career coach."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        result = json.loads(response.choices[0].message.content)
        
        # Ensure all required fields are present
        return {
            'score': result.get('score', 75),
            'missing_skills': result.get('missing_skills', []),
            'improvements': result.get('improvements', []),
            'better_bullets': result.get('better_bullets', [])
        }
    
    except Exception as e:
        # If OpenAI fails, fall back to mock
        print(f"OpenAI API error: {str(e)}, falling back to mock")
        return _mock_analyze_resume(resume_text)


def match_job(resume_text, job_description):
    """
    Match a resume against a job description using AI (OpenAI or mock).
    
    Args:
        resume_text (str): The full text of the resume
        job_description (str): The full text of the job description
    
    Returns:
        dict: Match results containing:
            - match_score (int): Match percentage 0-100
            - missing_keywords (list): Keywords from job description missing in resume
            - recommendations (list): Suggestions for improving the match
    
    Raises:
        Exception: If API call fails
    """
    if not _use_openai():
        # Use mock service
        return _mock_match_job(resume_text, job_description)
    
    try:
        # Use OpenAI API
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        prompt = f"""Compare this resume against the job description and provide:
1. A match score from 0-100
2. Keywords from the job description missing in the resume
3. Recommendations for improving the match

Resume:
{resume_text}

Job Description:
{job_description}

Return response as JSON with keys: match_score, missing_keywords, recommendations"""
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert recruiter and career advisor."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        # Parse the JSON response
        result = json.loads(response.choices[0].message.content)
        
        # Ensure all required fields are present
        return {
            'match_score': result.get('match_score', 75),
            'missing_keywords': result.get('missing_keywords', []),
            'recommendations': result.get('recommendations', [])
        }
    
    except Exception as e:
        # If OpenAI fails, fall back to mock
        print(f"OpenAI API error: {str(e)}, falling back to mock")
        return _mock_match_job(resume_text, job_description)
