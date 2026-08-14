import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let client: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

function getClient(): GoogleGenerativeAI {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env.local file.');
  }
  if (!client) {
    client = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return client;
}

function getModel(): GenerativeModel {
  if (!model) {
    model = getClient().getGenerativeModel({
      model: 'gemini-1.5-flash', // Fast model for most requests
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2048,
      },
    });
  }
  return model;
}

export async function generateText(prompt: string, systemInstruction?: string): Promise<string> {
  if (GEMINI_API_KEY && GEMINI_API_KEY.includes('your-gemini')) {
    // Mock response for local development without API key
    await new Promise(r => setTimeout(r, 1500));
    
    if (prompt.includes('resume summary')) {
      return "Results-driven professional with a proven track record of delivering high-quality solutions. Skilled in driving projects from conception to completion while optimizing processes and fostering cross-functional collaboration.";
    }

    return `Dear Hiring Manager,

I am writing to express my strong interest in the open position at your company. With a solid foundation in the required skills and a proven track record of delivering results, I am confident in my ability to make an immediate impact on your team.

My background includes successfully tackling complex challenges and driving projects to completion. I am particularly drawn to your company's mission and would welcome the opportunity to contribute my technical expertise and problem-solving skills to your upcoming initiatives.

Thank you for your time and consideration. I look forward to the possibility of discussing this exciting opportunity with you.

Sincerely,
The Candidate`;
  }

  const m = getModel();

  const fullPrompt = systemInstruction
    ? `SYSTEM: ${systemInstruction}\n\nUSER: ${prompt}`
    : prompt;

  const result = await m.generateContent(fullPrompt);
  const response = result.response;
  return response.text();
}

export async function generateJSON<T>(prompt: string, systemInstruction: string): Promise<T> {
  if (GEMINI_API_KEY && GEMINI_API_KEY.includes('your-gemini')) {
    // Mock JSON response for ATS checker/Job Matcher
    await new Promise(r => setTimeout(r, 1500));
    
    if (prompt.includes('improve this resume bullet point')) {
      return {
        problems: ["Lacks quantifiable metrics", "Uses weak action verbs"],
        improvedBullet: "Spearheaded development initiatives that increased system efficiency by 25% and reduced load times.",
        improvements: ["Added strong action verb", "Included a quantifiable result"]
      } as unknown as T;
    }

    const isAts = prompt.includes('Analyze the following resume for ATS compatibility');
    if (isAts) {
      return {
        score: 75,
        missingKeywords: ["Agile", "TypeScript"],
        formattingIssues: ["Include more quantifiable metrics"],
        sectionFeedback: [
          { section: "experience", feedback: "Good detail, but use stronger action verbs." }
        ],
        overallSummary: "Your resume is fairly ATS-friendly but missing some key terms from the target role."
      } as unknown as T;
    }
    // Mock for Job Matcher
    if (prompt.includes('Compare this resume')) {
       return {
         matchScore: 82,
         matchedKeywords: ["React", "JavaScript", "CSS"],
         missingKeywords: ["GraphQL", "Node.js"],
         recommendations: ["Add a project demonstrating GraphQL", "Highlight backend experience"]
       } as unknown as T;
    }
    return {} as T;
  }

  const m = getClient().getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig: {
      temperature: 0.3, // Lower temp for structured output
      responseMimeType: 'application/json',
    },
  });

  const fullPrompt = `SYSTEM: ${systemInstruction}\n\nUSER: ${prompt}\n\nRespond with valid JSON only.`;
  const result = await m.generateContent(fullPrompt);
  const text = result.response.text();

  try {
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]) as T;
    throw new Error('AI returned invalid JSON response');
  }
}

// Anti-fabrication system instruction
export const ANTI_FABRICATION_INSTRUCTION = `
You are a professional resume writing assistant. Your role is to IMPROVE and OPTIMIZE text, NOT to invent information.

STRICT RULES:
1. NEVER invent or fabricate: skills, technologies, companies, job titles, metrics, achievements, certifications, or dates
2. ONLY use information explicitly provided in the resume data
3. If asked to add a metric, only do so if one exists in the provided content
4. You may rephrase, restructure, and improve clarity and impact of existing content
5. If a bullet says "worked on X", improve it to "Developed/Built/Implemented X" — but do not add specifics that weren't mentioned
6. Your output must be factually grounded in the provided resume content
`;
