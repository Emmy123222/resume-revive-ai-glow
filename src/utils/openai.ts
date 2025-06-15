
const OPENAI_API_URL = 'https://api.openai.com/chat/completions';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callOpenAI(messages: OpenAIMessage[], apiKey: string): Promise<string> {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4-1106-preview',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

export function createResumePrompt(resume: string, jobDescription: string): OpenAIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an expert resume writer and career coach. Your task is to tailor resumes to specific job postings while maintaining authenticity and accuracy. 

Guidelines:
- Optimize for ATS (Applicant Tracking System) compatibility
- Use keywords from the job description naturally
- Enhance bullet points to highlight relevant experience
- Maintain the original structure and truthfulness
- Focus on quantifiable achievements when possible
- Match the tone and language style of the job posting`
    },
    {
      role: 'user',
      content: `Please tailor this resume for the following job posting:

JOB POSTING:
${jobDescription}

ORIGINAL RESUME:
${resume}

Please provide an optimized version that better matches the job requirements while keeping all information truthful and accurate.`
    }
  ];
}

export function createCoverLetterPrompt(resume: string, jobDescription: string): OpenAIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an expert cover letter writer. Create compelling, personalized cover letters that connect the candidate's experience to the specific job requirements.

Guidelines:
- Keep it concise (3-4 paragraphs)
- Extract company name and position title from job description
- Highlight 2-3 key qualifications that match the role
- Show enthusiasm and cultural fit
- Use a professional yet engaging tone
- Include a strong opening and clear call to action`
    },
    {
      role: 'user',
      content: `Create a cover letter for this job application:

JOB POSTING:
${jobDescription}

CANDIDATE RESUME:
${resume}

Please write a compelling cover letter that connects the candidate's background to this specific opportunity.`
    }
  ];
}

export function createInterviewQuestionsPrompt(jobDescription: string, resume: string): OpenAIMessage[] {
  return [
    {
      role: 'system',
      content: `You are an expert interview coach. Generate realistic interview questions based on the job posting and provide personalized answers based on the candidate's background.

Guidelines:
- Create 5-6 diverse questions (behavioral, technical, situational)
- Include common questions and role-specific ones
- Provide STAR method answers when appropriate
- Keep answers authentic to the candidate's experience
- Include questions about company culture and the specific role
- Format as JSON with question and answer fields`
    },
    {
      role: 'user',
      content: `Generate interview questions and personalized answers for this scenario:

JOB POSTING:
${jobDescription}

CANDIDATE RESUME:
${resume}

Please return a JSON array of objects with "question" and "answer" fields.`
    }
  ];
}
