import type { CandidateProfile, ExperienceItem, EducationItem } from '../types';

/**
 * Heuristically parses candidate information from raw resume text.
 */
export function parseCandidateProfile(text: string): CandidateProfile {
  if (!text) {
    return {
      name: null,
      email: null,
      phone: null,
      linkedin: null,
      github: null,
      portfolio: null,
      skills: [],
      education: [],
      experience: [],
      certifications: [],
    };
  }

  // Regex definitions
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  // Simple phone matcher (supports international format)
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/gi;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/gi;
  // Generic URL matcher excluding common non-portfolio sites
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?(?!github|linkedin|google|facebook|twitter|instagram|youtube)[a-zA-Z0-9-]+\.[a-z]{2,}(?:\/[a-zA-Z0-9_#-]+)*/gi;

  // Clean lines of text
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // 1. Detect candidate name
  // Standard heuristics: The name is typically one of the first few non-blank lines,
  // contains only letters and spaces, and doesn't contain email, website or phone patterns.
  let name: string | null = null;
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    
    const isContactInfo =
      line.includes('@') ||
      line.includes('/') ||
      line.toLowerCase().includes('resume') ||
      line.toLowerCase().includes('curriculum') ||
      line.toLowerCase().includes('page') ||
      phoneRegex.test(line) ||
      linkedinRegex.test(line) ||
      githubRegex.test(line);

    const wordCount = line.split(/\s+/).length;

    if (!isContactInfo && wordCount >= 2 && wordCount <= 4 && /^[a-zA-Z\s.']{3,35}$/.test(line)) {
      name = line;
      break;
    }
  }

  // Reset regex index states
  phoneRegex.lastIndex = 0;
  linkedinRegex.lastIndex = 0;
  githubRegex.lastIndex = 0;
  portfolioRegex.lastIndex = 0;

  // 2. Extract contact details
  const emails = text.match(emailRegex);
  const phones = text.match(phoneRegex);
  const linkedins = text.match(linkedinRegex);
  const githubs = text.match(githubRegex);
  const portfolios = text.match(portfolioRegex);

  // 3. Extract skills using keyword dictionary lookup
  const skillKeywords = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express',
    'NestJS', 'Python', 'Django', 'Flask', 'FastAPI', 'Go', 'Golang', 'Rust', 'C++', 'Java',
    'Spring Boot', 'Ruby on Rails', 'PHP', 'Laravel', 'HTML5', 'CSS3', 'Tailwind CSS', 'Sass',
    'Redux', 'Zustand', 'GraphQL', 'REST API', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
    'SQLite', 'Firebase', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
    'GitHub', 'GitLab', 'Jenkins', 'Terraform', 'Linux', 'Bash', 'Jest', 'Cypress', 'Playwright',
    'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Data Science', 'SQL',
    'NoSQL', 'Framer Motion', 'Webpack', 'Vite', 'GraphQL', 'Microservices', 'Unit Testing'
  ];

  const foundSkills = new Set<string>();
  skillKeywords.forEach((skill) => {
    // Prevent substring matches like 'Go' matching inside 'Google'
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const boundaryRegex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (boundaryRegex.test(text)) {
      foundSkills.add(skill);
    }
  });

  // 4. Extract Education items
  const educationItems: EducationItem[] = [];
  const eduKeywords = ['University', 'College', 'Institute', 'School', 'Academy', 'Polytechnic'];
  const degreeKeywords = ['Bachelor', 'Master', 'Ph.D.', 'PhD', 'B.S.', 'B.A.', 'M.S.', 'M.A.', 'B.Tech', 'M.Tech', 'Degree', 'Associate', 'Diploma'];

  lines.forEach((line, index) => {
    const isEduLine = eduKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()));
    const hasDegree = degreeKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()));
    
    if (isEduLine || hasDegree) {
      // Find year in the current line or in the adjacent next line
      const yearMatch = line.match(/\b(19\d{2}|20\d{2})\b/);
      let year = yearMatch ? yearMatch[0] : '';
      
      if (!year && index < lines.length - 1) {
        const nextLineMatch = lines[index + 1].match(/\b(19\d{2}|20\d{2})\b/);
        if (nextLineMatch) year = nextLineMatch[0];
      }

      let institution = 'Unknown Institution';
      let degree = 'Degree / Studies';

      if (isEduLine) {
        institution = line;
        if (index > 0 && hasDegree) {
          degree = lines[index - 1];
        } else if (index < lines.length - 1 && degreeKeywords.some((kd) => lines[index + 1].toLowerCase().includes(kd.toLowerCase()))) {
          degree = lines[index + 1];
        }
      } else {
        degree = line;
        if (index > 0 && eduKeywords.some((ke) => lines[index - 1].toLowerCase().includes(ke.toLowerCase()))) {
          institution = lines[index - 1];
        } else if (index < lines.length - 1 && eduKeywords.some((ke) => lines[index + 1].toLowerCase().includes(ke.toLowerCase()))) {
          institution = lines[index + 1];
        }
      }

      // Standardize outputs to prevent long texts breaking our layout
      if (institution.length > 60) institution = institution.substring(0, 60) + '...';
      if (degree.length > 60) degree = degree.substring(0, 60) + '...';

      // Avoid adding duplicated education lines
      if (!educationItems.some((item) => item.institution === institution && item.degree === degree)) {
        educationItems.push({ institution, degree, year });
      }
    }
  });

  // 5. Extract Experience items
  const experienceItems: ExperienceItem[] = [];
  const commonRoles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Mobile Developer', 'DevOps Engineer', 'Data Scientist', 'Machine Learning Engineer',
    'Product Manager', 'UX Designer', 'UI Designer', 'Systems Engineer', 'Solutions Architect',
    'QA Engineer', 'Technical Lead', 'Engineering Manager', 'Intern', 'Developer', 'Analyst'
  ];

  lines.forEach((line, index) => {
    const matchedRole = commonRoles.find((role) => {
      const escaped = role.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\b`, 'i');
      return regex.test(line);
    });

    if (matchedRole) {
      let company = 'Unknown Company';
      let duration = 'Present';

      // Scan for duration dates in this line
      const dateMatch = line.match(
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[A-Za-z]+)?\s?\b(19\d{2}|20\d{2})\b\s*(?:-|to)\s*(?:Present|\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[A-Za-z]+)?\s?\b(19\d{2}|20\d{2})\b)/i
      );
      
      if (dateMatch) {
        duration = dateMatch[0];
      } else {
        const years = line.match(/\b(20\d{2})\b/g);
        if (years && years.length >= 1) {
          duration = years.join(' - ');
        }
      }

      // Guess company: search after words like "@" or "at"
      const atMatch = line.match(/\bat\s+([A-Z][A-Za-z0-9\s,&]+)/);
      if (atMatch) {
        company = atMatch[1].trim();
      } else if (index > 0 && lines[index - 1].length < 40 && !commonRoles.some((r) => lines[index - 1].toLowerCase().includes(r.toLowerCase()))) {
        company = lines[index - 1];
      }

      // Collect description bullet points from subsequent lines
      const descLines: string[] = [];
      for (let j = 1; j <= 3; j++) {
        if (index + j < lines.length) {
          const nextLine = lines[index + j];
          if (
            nextLine.startsWith('•') ||
            nextLine.startsWith('-') ||
            nextLine.startsWith('*') ||
            nextLine.length > 50
          ) {
            descLines.push(nextLine.replace(/^[•\-*]\s*/, ''));
          } else {
            break;
          }
        }
      }

      const description = descLines.join(' ');

      if (!experienceItems.some((item) => item.role === matchedRole && item.company === company)) {
        experienceItems.push({
          role: matchedRole,
          company,
          duration,
          description: description || 'Developed applications, engineered scalable features, and collaborated with cross-functional teams.',
        });
      }
    }
  });

  // 6. Extract Certifications
  const certifications: string[] = [];
  const certKeywords = ['Certified', 'Certification', 'Credentials', 'AWS Certified', 'Scrum Master', 'PMP', 'CompTIA', 'CCNA', 'Udemy', 'Coursera'];
  
  lines.forEach((line) => {
    const isCert = certKeywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase()));
    if (isCert && line.length < 80) {
      const cleanedCert = line.replace(/^[•\-*]\s*/, '').trim();
      if (!certifications.includes(cleanedCert)) {
        certifications.push(cleanedCert);
      }
    }
  });

  return {
    name: name || (emails && emails.length > 0 ? emails[0].split('@')[0].replace(/[._]/g, ' ') : 'Candidate Name'),
    email: emails && emails.length > 0 ? emails[0] : null,
    phone: phones && phones.length > 0 ? phones[0] : null,
    linkedin: linkedins && linkedins.length > 0 ? linkedins[0] : null,
    github: githubs && githubs.length > 0 ? githubs[0] : null,
    portfolio: portfolios && portfolios.length > 0 ? portfolios[0] : null,
    skills: Array.from(foundSkills),
    education: educationItems.slice(0, 3),
    experience: experienceItems.slice(0, 4),
    certifications: certifications.slice(0, 5),
  };
}
