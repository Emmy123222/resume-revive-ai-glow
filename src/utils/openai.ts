const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Utility to trim long text safely
function safeTrim(text: string, maxLength = 4000): string {
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

// ✅ Vite-safe frontend API key usage
const apiKey = import.meta.env.VITE_GROQ_API_KEY;
if (!apiKey) {
  throw new Error('Missing GROQ API key. Define VITE_GROQ_API_KEY in your .env file.');
}

// 🔁 Retry helper with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delayMs = 3000): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const response = await fetch(url, options);
    
    if (response.status !== 429) {
      return response;
    }

    if (attempt < retries) {
      console.warn(`Rate limited. Retry ${attempt + 1}/${retries} after ${delayMs}ms`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    } else {
      return response; // final attempt result
    }
  }

  throw new Error('Max retries exceeded.');
}

export async function callOpenAI(messages: OpenAIMessage[]): Promise<string> {
  const requestPayload = {
    model: 'llama3-70b-8192',
    messages,
    temperature: 0.7,
    max_tokens: 1000, // Safer default
  };

  const response = await fetchWithRetry(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Groq API error: ${response.status} ${response.statusText} - ${errorData}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

// 🧠 Tailored Resume Prompt
export function createResumePrompt(resume: string, jobDescription: string): OpenAIMessage[] {
  const safeResume = safeTrim(resume, 3500);
  const safeJobDescription = safeTrim(jobDescription, 2000);

  return [
    {
      role: 'system',
      content: `You're an expert resume writer. Optimize resumes for job descriptions with ATS compatibility. Keep it truthful and impactful.`,
    },
    {
      role: 'user',
      content: `Please tailor this resume for the following job posting:

JOB POSTING:
${safeJobDescription}

ORIGINAL RESUME:
${safeResume}

Please provide an optimized version that better matches the job requirements.`,
    },
  ];
}

// ✍️ Cover Letter Prompt
export function createCoverLetterPrompt(resume: string, jobDescription: string): OpenAIMessage[] {
  const safeResume = safeTrim(resume, 3500);
  const safeJobDescription = safeTrim(jobDescription, 2000);

  return [
    {
      role: 'system',
      content: `You're an expert cover letter writer. Create concise, personalized cover letters that connect experience to job requirements. Use a professional and engaging tone.`,
    },
    {
      role: 'user',
      content: `Create a cover letter for this job:

JOB POSTING:
${safeJobDescription}

CANDIDATE RESUME:
${safeResume}`,
    },
  ];
}

// 🎤 Interview Questions Prompt
export function createInterviewQuestionsPrompt(jobDescription: string, resume: string): OpenAIMessage[] {
  const safeResume = safeTrim(resume, 3500);
  const safeJobDescription = safeTrim(jobDescription, 2000);

  return [
    {
      role: 'system',
      content: `You're an interview coach. Generate 5-6 realistic questions with STAR-style answers based on the job and resume. Format as JSON with "question" and "answer".`,
    },
    {
      role: 'user',
      content: `Generate interview Q&A for:

JOB POSTING:
${safeJobDescription}

RESUME:
${safeResume}`,
    },
  ];
}
