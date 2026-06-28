import { z } from 'zod';
import type { AIAnalysisResponse } from '../types';

// API Configuration
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
const DEFAULT_TIMEOUT = 30000; // 30 seconds

// Zod schemas for AI response validation
const keywordGapSchema = z.object({
  keyword: z.string(),
  importance: z.enum(['High', 'Medium', 'Low']),
});

const strengthSchema = z.object({
  title: z.string(),
  explanation: z.string(),
});

const weaknessSchema = z.object({
  issue: z.string(),
  impact: z.string(),
  suggestion: z.string(),
});

const improvementSchema = z.object({
  priority: z.enum(['High', 'Medium', 'Low']),
  reason: z.string(),
  action: z.string(),
  impact: z.string(),
});

export const aiResponseSchema = z.object({
  ats_score: z.number().min(0).max(100),
  job_match_score: z.number().min(0).max(100),
  hiring_probability: z.number().min(0).max(100),
  hiring_readiness: z.enum(['Low', 'Moderate', 'Strong', 'Excellent']),
  missing_skills: z.array(z.string()),
  missing_keywords: z.array(z.string()),
  keyword_gaps: z.array(keywordGapSchema),
  strengths: z.array(strengthSchema),
  weaknesses: z.array(weaknessSchema),
  ats_suggestions: z.array(z.string()),
  improvement_suggestions: z.array(improvementSchema),
  recommended_resume_changes: z.array(z.string()),
  certifications_to_consider: z.array(z.string()),
  experience_gaps: z.array(z.string()),
  soft_skill_gaps: z.array(z.string()),
  technical_skill_gaps: z.array(z.string()),
  summary: z.string(),
  final_verdict: z.enum(['Excellent Match', 'Strong Match', 'Moderate Match', 'Weak Match']),
});

/**
 * Strips markdown block elements like ```json and ``` from AI text.
 */
function cleanJsonResponse(rawText: string): string {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(json)?/i, '').replace(/```$/, '').trim();
  }
  return cleaned;
}

/**
 * Defensive recovery fallback ensuring that any parsed JSON matches the schema requirements.
 */
export function repairAIResponse(data: any, precalculatedAts: number): AIAnalysisResponse {
  const getNumber = (val: any, fallback: number) => {
    if (typeof val === 'number') return val;
    const num = Number(val);
    return isNaN(num) ? fallback : num;
  };

  return {
    ats_score: getNumber(data.ats_score, precalculatedAts),
    job_match_score: getNumber(data.job_match_score, Math.round(precalculatedAts * 0.95)),
    hiring_probability: getNumber(data.hiring_probability, Math.round(precalculatedAts * 0.9)),
    hiring_readiness: ['Low', 'Moderate', 'Strong', 'Excellent'].includes(data.hiring_readiness)
      ? data.hiring_readiness
      : 'Moderate',
    missing_skills: Array.isArray(data.missing_skills) ? data.missing_skills : [],
    missing_keywords: Array.isArray(data.missing_keywords) ? data.missing_keywords : [],
    keyword_gaps: Array.isArray(data.keyword_gaps)
      ? data.keyword_gaps.map((item: any) => ({
          keyword: String(item.keyword || item || 'Keyword'),
          importance: ['High', 'Medium', 'Low'].includes(item.importance) ? item.importance : 'Medium',
        }))
      : [],
    strengths: Array.isArray(data.strengths)
      ? data.strengths.map((item: any) => ({
          title: String(item.title || 'Strength'),
          explanation: String(item.explanation || 'Demonstrates strong competence.'),
        }))
      : [
          { title: 'Relevant Experience', explanation: 'Professional background aligns with core tasks.' },
          { title: 'Technical Stack Familiarity', explanation: 'Mentions several relevant development tools.' }
        ],
    weaknesses: Array.isArray(data.weaknesses)
      ? data.weaknesses.map((item: any) => ({
          issue: String(item.issue || 'Experience Mismatch'),
          impact: String(item.impact || 'May not display sufficient depth.'),
          suggestion: String(item.suggestion || 'Expand on specific project metrics.'),
        }))
      : [],
    ats_suggestions: Array.isArray(data.ats_suggestions) ? data.ats_suggestions : [],
    improvement_suggestions: Array.isArray(data.improvement_suggestions)
      ? data.improvement_suggestions.map((item: any) => ({
          priority: ['High', 'Medium', 'Low'].includes(item.priority) ? item.priority : 'Medium',
          reason: String(item.reason || ''),
          action: String(item.action || ''),
          impact: String(item.impact || ''),
        }))
      : [],
    recommended_resume_changes: Array.isArray(data.recommended_resume_changes) ? data.recommended_resume_changes : [],
    certifications_to_consider: Array.isArray(data.certifications_to_consider) ? data.certifications_to_consider : [],
    experience_gaps: Array.isArray(data.experience_gaps) ? data.experience_gaps : [],
    soft_skill_gaps: Array.isArray(data.soft_skill_gaps) ? data.soft_skill_gaps : [],
    technical_skill_gaps: Array.isArray(data.technical_skill_gaps) ? data.technical_skill_gaps : [],
    summary: String(data.summary || 'Summary could not be generated. Please evaluate matching sections manually.'),
    final_verdict: ['Excellent Match', 'Strong Match', 'Moderate Match', 'Weak Match'].includes(data.final_verdict)
      ? data.final_verdict
      : 'Moderate Match',
  };
}

/**
 * AI Recruiter analysis fetch request pointing to OpenRouter
 */
export async function fetchAIAnalysisFromOpenRouter(
  resumeText: string,
  candidateInfo: any,
  jobDescription: string,
  atsScore: number,
  customSignal?: AbortSignal
): Promise<AIAnalysisResponse> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('VITE_OPENROUTER_API_KEY is missing from environment. Please add it to your .env file.');
  }

  // Create AbortController to support timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  // Link signals
  const cleanupSignal = () => clearTimeout(timeoutId);
  
  if (customSignal) {
    customSignal.addEventListener('abort', () => {
      controller.abort();
      cleanupSignal();
    });
  }

  const systemPrompt = `You are a Senior ATS Recruiter, Fortune 500 Hiring Manager, Resume Optimization Expert, Career Coach, Technical Interview Screener, and Talent Acquisition Lead.
Analyze the candidate's resume, parsed metadata, target job description, and pre-calculated ATS score.

Your analysis MUST evaluate:
1. ATS score alignment and structural compatibility.
2. Skill mapping (technical & soft skills overlaps and gaps).
3. Keyword coverage (missing keywords, showing Importance levels: High, Medium, Low).
4. Major professional Strengths (Title and Explanation) and Weaknesses (Issue, Impact, and Suggestion).
5. Comprehensive structural ATS formatting improvements.
6. Actionable recommendations (Priority: High, Medium, Low; Reason, Action, Impact).

OUTPUT INSTRUCTIONS:
- You MUST return a STRICT JSON block ONLY.
- Never wrap your output in markdown formatting (Do NOT use \`\`\`json or \`\`\`).
- Never explain anything outside the JSON structure.
- The output must parse as valid, clean JSON directly.

JSON SCHEMA TO RETURN:
{
  "ats_score": ${atsScore},
  "job_match_score": [number 0-100 representing how closely skills map to requirements],
  "hiring_probability": [number 0-100 representing probability of passing initial recruiter screening],
  "hiring_readiness": "Low" | "Moderate" | "Strong" | "Excellent",
  "missing_skills": ["skill1", "skill2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "keyword_gaps": [
    { "keyword": "term", "importance": "High" | "Medium" | "Low" }
  ],
  "strengths": [
    { "title": "Strength Title", "explanation": "Detail explanation" }
  ],
  "weaknesses": [
    { "issue": "Problem details", "impact": "How it affects recruitment", "suggestion": "How to resolve this in the text" }
  ],
  "ats_suggestions": ["format suggestion 1", "format suggestion 2"],
  "improvement_suggestions": [
    { "priority": "High" | "Medium" | "Low", "reason": "Why this change is needed", "action": "Exact rewrite or edit to make", "impact": "Expected score increase details" }
  ],
  "recommended_resume_changes": ["change 1", "change 2"],
  "certifications_to_consider": ["cert 1"],
  "experience_gaps": ["gap 1"],
  "soft_skill_gaps": ["soft skill gap 1"],
  "technical_skill_gaps": ["tech gap 1"],
  "summary": "Professional recruitment evaluation summary paragraph.",
  "final_verdict": "Excellent Match" | "Strong Match" | "Moderate Match" | "Weak Match"
}`;

  const userPrompt = `
RESUME TEXT CONTENT:
"""
${resumeText}
"""

CANDIDATE INFORMATION METADATA:
${JSON.parse(JSON.stringify(candidateInfo || {}))}

TARGET JOB DESCRIPTION DETAILS:
"""
${jobDescription}
"""

PRE-CALCULATED BASE ATS SCORE: ${atsScore}
`;

  let lastError: any = null;
  const maxRetries = 2;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (controller.signal.aborted) {
        throw new Error('API Request aborted by client.');
      }

      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://resumeiq.local', // Site URL for OpenRouter ranking
          'X-Title': 'ResumeIQ Analyzer',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.2,
          response_format: { type: 'json_object' }
        }),
        signal: controller.signal,
      });

      cleanupSignal();

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API responded with status ${response.status}: ${errorText || response.statusText}`);
      }

      const responseData = await response.json();
      const rawText = responseData.choices?.[0]?.message?.content;
      
      if (!rawText) {
        throw new Error('Empty response payload from OpenRouter model.');
      }

      const cleanedText = cleanJsonResponse(rawText);
      
      try {
        const jsonObject = JSON.parse(cleanedText);
        // Validating with Zod schema
        const validatedData = aiResponseSchema.parse(jsonObject);
        return validatedData as AIAnalysisResponse;
      } catch (jsonErr) {
        console.warn('JSON parsing or Zod verification failed, attempting fallback repair.', jsonErr);
        // Attempt JSON extraction fallback if there is text surrounding JSON
        const match = cleanedText.match(/\{[\s\S]*\}/);
        if (match) {
          try {
            const repairedObj = JSON.parse(match[0]);
            return repairAIResponse(repairedObj, atsScore);
          } catch {
            // repair fails
          }
        }
        throw new Error('The AI generated an invalid JSON format. Please retry the analysis.');
      }
    } catch (err: any) {
      lastError = err;
      if (err.name === 'AbortError') {
        throw new Error('The AI request timed out or was cancelled by user. Please try again.');
      }
      
      console.warn(`API attempt ${attempt + 1} failed. Retrying...`, err);
      // Wait before retry
      if (attempt < maxRetries) {
        await new Promise((res) => setTimeout(res, 1000 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Failed to connect to OpenRouter AI services.');
}
export default fetchAIAnalysisFromOpenRouter;

// Zod schema for optimized resume response
const optimizedExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  duration: z.string(),
  bullet_points: z.array(z.string()),
});

const optimizedProjectSchema = z.object({
  title: z.string(),
  technologies: z.array(z.string()),
  bullet_points: z.array(z.string()),
});

export const optimizedResumeSchema = z.object({
  header: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
  }),
  professional_summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(optimizedExperienceSchema),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string(),
    })
  ),
  projects: z.array(optimizedProjectSchema),
  certifications: z.array(z.string()),
  achievements: z.array(z.string()),
});

import type { OptimizedResumeResponse } from '../types';

/**
 * Fallback repair function for optimized resume JSON responses.
 */
export function repairOptimizedResume(data: any, candidateInfo: any): OptimizedResumeResponse {
  return {
    header: {
      name: String(data.header?.name || candidateInfo?.name || 'Candidate Name'),
      email: String(data.header?.email || candidateInfo?.email || 'email@example.com'),
      phone: String(data.header?.phone || candidateInfo?.phone || ''),
      linkedin: data.header?.linkedin ? String(data.header.linkedin) : candidateInfo?.linkedin || undefined,
      github: data.header?.github ? String(data.header.github) : candidateInfo?.github || undefined,
      portfolio: data.header?.portfolio ? String(data.header.portfolio) : candidateInfo?.portfolio || undefined,
    },
    professional_summary: String(
      data.professional_summary || 
      'Results-driven professional with experience in software engineering, development, and team collaboration.'
    ),
    skills: Array.isArray(data.skills) ? data.skills : candidateInfo?.skills || [],
    experience: Array.isArray(data.experience)
      ? data.experience.map((item: any) => ({
          role: String(item.role || 'Software Engineer'),
          company: String(item.company || 'Technology Company'),
          duration: String(item.duration || 'Present'),
          bullet_points: Array.isArray(item.bullet_points) ? item.bullet_points.map(String) : [],
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((item: any) => ({
          degree: String(item.degree || 'Bachelor of Science'),
          institution: String(item.institution || 'University'),
          year: String(item.year || ''),
        }))
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map((item: any) => ({
          title: String(item.title || 'Software Project'),
          technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : [],
          bullet_points: Array.isArray(item.bullet_points) ? item.bullet_points.map(String) : [],
        }))
      : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : candidateInfo?.certifications || [],
    achievements: Array.isArray(data.achievements) ? data.achievements : [],
  };
}

/**
 * Secondary AI call that rewrites the resume into an ATS-optimized structure.
 */
export async function generateResumeRecommendation(
  resumeText: string,
  candidateInfo: any,
  jobDescription: string,
  atsScore: number,
  jobMatchScore: number,
  aiAnalysisRaw: any,
  customSignal?: AbortSignal
): Promise<OptimizedResumeResponse> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_OPENROUTER_API_KEY is missing from environment. Please add it to your .env file.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT * 1.5); // Give a bit more time for full resume generation

  const cleanupSignal = () => clearTimeout(timeoutId);

  if (customSignal) {
    customSignal.addEventListener('abort', () => {
      controller.abort();
      cleanupSignal();
    });
  }

  const systemPrompt = `You are a Senior ATS Recruiter, Fortune 500 Hiring Manager, Resume Optimization Expert, and Career Coach.
Using the original resume content, candidate profile details, target job description, pre-calculated ATS score (${atsScore}), and the AI recruiter's analysis matches, rewrite and structure the resume into an ATS-OPTIMIZED single-column layout description.

Objectives:
- Create a powerful Professional Summary that highlights relevant keywords from the job description.
- Re-order and standardize technical/soft skills listing the most relevant first.
- Rewrite experience descriptions into active-verb action bullet points with estimated quantifiable metrics and keyword density.
- Organize projects, certifications, and achievements.

OUTPUT INSTRUCTIONS:
- You MUST return a STRICT JSON block ONLY.
- Do NOT wrap the JSON block in markdown code indicator tags (No \`\`\`json or \`\`\`).
- Never explain anything outside the JSON structure.

JSON SCHEMA TO RETURN:
{
  "header": {
    "name": "Candidate Full Name",
    "email": "candidate@email.com",
    "phone": "Phone details",
    "linkedin": "optional linkedin profile url",
    "github": "optional github profile url",
    "portfolio": "optional website url"
  },
  "professional_summary": "ATS-optimized summary highlighting key alignments.",
  "skills": ["Skill1", "Skill2", "Skill3"],
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Duration (e.g. 2021 - Present)",
      "bullet_points": [
        "Action verb description mapping core tools and metrics.",
        "Detailed result metrics matching job needs."
      ]
    }
  ],
  "education": [
    {
      "degree": "Degree Title",
      "institution": "University / Institution Name",
      "year": "Graduation Year"
    }
  ],
  "projects": [
    {
      "title": "Project Title",
      "technologies": ["React", "TypeScript"],
      "bullet_points": [
        "Development contribution detail.",
        "Output highlight."
      ]
    }
  ],
  "certifications": ["Certification name 1", "Certification name 2"],
  "achievements": ["Achievement 1", "Achievement 2"]
}`;

  const userPrompt = `
ORIGINAL RESUME TEXT:
"""
${resumeText}
"""

CANDIDATE INFORMATION:
${JSON.stringify(candidateInfo || {})}

TARGET JOB DESCRIPTION:
"""
${jobDescription}
"""

PRE-CALCULATED ATS MATCH SCORE: ${atsScore}
ROLE MATCH SCORE: ${jobMatchScore}

RECRUITER AI DIAGNOSTICS:
${JSON.stringify({
  missing_skills: aiAnalysisRaw.missing_skills,
  missing_keywords: aiAnalysisRaw.missing_keywords,
  weaknesses: aiAnalysisRaw.weaknesses,
  ats_suggestions: aiAnalysisRaw.ats_suggestions
})}
`;



  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://resumeiq.local',
        'X-Title': 'ResumeIQ Optimizer',
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal,
    });

    cleanupSignal();

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API responded with status ${response.status}: ${errorText || response.statusText}`);
    }

    const responseData = await response.json();
    const rawText = responseData.choices?.[0]?.message?.content;

    if (!rawText) {
      throw new Error('Empty response payload from OpenRouter optimizer model.');
    }

    const cleanedText = cleanJsonResponse(rawText);

    try {
      const jsonObject = JSON.parse(cleanedText);
      const validatedData = optimizedResumeSchema.parse(jsonObject);
      return validatedData as OptimizedResumeResponse;
    } catch (jsonErr) {
      console.warn('Optimized resume parsing failed, attempting fallback repair.', jsonErr);
      const match = cleanedText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          const repairedObj = JSON.parse(match[0]);
          return repairOptimizedResume(repairedObj, candidateInfo);
        } catch {
          // repair fails
        }
      }
      return repairOptimizedResume({}, candidateInfo); // absolute fallback
    }
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('The resume recommendation request timed out. Please try again.');
    }
    throw err;
  }
}

