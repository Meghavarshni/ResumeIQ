/**
 * Client-Side Heuristic ATS Score Calculator
 */

// List of standard stop words to exclude from keyword matching
const STOP_WORDS = new Set([
  'the', 'and', 'a', 'of', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 
  'his', 'they', 'i', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what',
  'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how',
  'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her',
  'would', 'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see', 'number',
  'no', 'way', 'could', 'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil', 'its', 'now',
  'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part', 'over', 'new', 'take', 'only',
  'work', 'our', 'well', 'here', 'such', 'take', 'through', 'must', 'after', 'also', 'because', 'both', 'between'
]);

// Set of standard technical skills to scan explicitly
const SKILL_DICTIONARY = [
  'javascript', 'typescript', 'react', 'angular', 'vue', 'next.js', 'node.js', 'express',
  'nestjs', 'python', 'django', 'flask', 'fastapi', 'go', 'golang', 'rust', 'c++', 'java',
  'spring boot', 'ruby', 'rails', 'php', 'laravel', 'html', 'css', 'tailwind', 'sass',
  'redux', 'zustand', 'graphql', 'rest', 'api', 'postgresql', 'mongodb', 'mysql', 'redis',
  'sqlite', 'firebase', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'git',
  'github', 'gitlab', 'jenkins', 'terraform', 'linux', 'bash', 'jest', 'cypress', 'playwright',
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'nlp', 'data science', 'sql',
  'nosql', 'microservices', 'unit testing', 'agile', 'scrum', 'project management'
];

/**
 * Tokenizes text and filters out non-alphabetic elements and stop words.
 */
function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+\s.#]/g, ' ') // Preserve symbols like C++, .NET, Nest.js, Node.js
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

export function calculateATSScore(resumeText: string, jobDescription: string): number {
  if (!resumeText || !jobDescription) return 0;

  const cleanResume = resumeText.toLowerCase();
  const cleanJD = jobDescription.toLowerCase();

  // 1. Keyword Matching (45% weight)
  const jdKeywords = Array.from(new Set(extractKeywords(jobDescription)));
  let keywordMatchCount = 0;
  
  if (jdKeywords.length > 0) {
    jdKeywords.forEach((keyword) => {
      // Escape for regex safety
      const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(cleanResume)) {
        keywordMatchCount++;
      }
    });
  }
  
  const keywordScore = jdKeywords.length > 0 
    ? (keywordMatchCount / jdKeywords.length) * 100 
    : 80;

  // 2. Explicit Skill Match (40% weight)
  const jdSkills = SKILL_DICTIONARY.filter((skill) => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(cleanJD);
  });

  let skillMatchCount = 0;
  if (jdSkills.length > 0) {
    jdSkills.forEach((skill) => {
      const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      if (regex.test(cleanResume)) {
        skillMatchCount++;
      }
    });
  }

  const skillScore = jdSkills.length > 0 
    ? (skillMatchCount / jdSkills.length) * 100 
    : 75;

  // 3. Document Formatting & Structure compliance (15% weight)
  let structuralPoints = 0;
  
  // Checks contact details
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
  
  if (hasEmail) structuralPoints += 20; // 3% of total
  if (hasPhone) structuralPoints += 20; // 3% of total

  // Checks standard section headers
  const headings = ['experience', 'education', 'skills', 'projects', 'summary', 'certification'];
  let headingsCount = 0;
  headings.forEach((heading) => {
    if (cleanResume.includes(heading)) {
      headingsCount++;
    }
  });
  
  structuralPoints += Math.min(headingsCount * 8, 40); // Max 6% of total

  // Check list layout readability
  const hasListLayout = cleanResume.includes('•') || cleanResume.includes('-') || cleanResume.includes('*');
  if (hasListLayout) structuralPoints += 20; // 3% of total

  const structuralScore = structuralPoints;

  // Total weighted calculation
  const totalScore = (keywordScore * 0.45) + (skillScore * 0.40) + (structuralScore * 0.15);
  
  // Bound to 0-100 and round to nearest integer
  return Math.min(Math.max(Math.round(totalScore), 0), 100);
}
