import json
from openai import AsyncOpenAI
import os

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", "dummy-key"))

class AIService:
    @staticmethod
    async def analyze_resume(resume_text: str, job_description: str) -> dict:
        prompt = f"""
        Analyze the following resume against the job description.
        Provide a JSON response with:
        - ats_score (0-100)
        - match_score (0-100)
        - hiring_recommendation (Strong Hire, Hire, Weak Hire, Do Not Hire)
        - strengths (list of strings)
        - weaknesses (list of strings)

        Job Description:
        {job_description}

        Resume:
        {resume_text}
        """
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error in analyze_resume: {e}")
            return {
                "ats_score": 0,
                "match_score": 0,
                "hiring_recommendation": "Error",
                "strengths": [],
                "weaknesses": []
            }

    @staticmethod
    async def analyze_live_transcript(transcript: str) -> dict:
        prompt = f"""
        Analyze this interview transcript excerpt from the candidate. 
        Provide a JSON response with scores (0-100) for:
        - confidence
        - communication
        - fluency
        - professionalism
        - technical_depth

        Also provide a brief 'sentiment' (e.g., Positive, Anxious, Neutral).

        Transcript:
        {transcript}
        """
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error in analyze_live_transcript: {e}")
            return {
                "confidence": 0,
                "communication": 0,
                "fluency": 0,
                "professionalism": 0,
                "technical_depth": 0,
                "sentiment": "Unknown"
            }

    @staticmethod
    async def generate_dynamic_question(context: str, previous_answer: str) -> str:
        prompt = f"""
        You are an expert technical interviewer.
        Based on the job context and the candidate's previous answer, generate ONE concise, relevant, and slightly more difficult follow-up question.

        Context: {context}
        Candidate's previous answer: {previous_answer}

        Return only the question text.
        """
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Error generating question: {e}")
            return "Could you elaborate more on your previous experience?"

    @staticmethod
    async def extract_profile_from_resume(content: bytes, filename: str) -> dict:
        # In a real app we would use PyPDF2 or similar to extract text from bytes
        # For demonstration, we'll pretend we extracted it and ask OpenAI
        
        prompt = f"""
        Extract professional profile data from the attached resume text.
        Return a JSON object matching this schema:
        {{
            "ai_intro": "A 2 sentence professional intro",
            "ats_score": 85.0,
            "profile_strength": 92.0,
            "skills": ["React", "Python", ...],
            "experiences": [
                {{"company": "...", "role": "...", "start_date": "...", "end_date": "...", "description": "...", "technologies": "..."}}
            ],
            "educations": [
                {{"school": "...", "degree": "...", "cgpa": "...", "start_year": "...", "end_year": "..."}}
            ]
        }}
        """
        
        try:
            # Simulation: In reality, we'd pass the actual parsed text to OpenAI
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error in extract_profile: {e}")
            return {
                "ai_intro": "An experienced professional in the field.",
                "ats_score": 75.0,
                "profile_strength": 80.0,
                "skills": [],
                "experiences": [],
                "educations": []
            }
