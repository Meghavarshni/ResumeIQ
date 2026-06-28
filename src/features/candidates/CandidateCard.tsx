import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  Award,
  ChevronRight,
  Code
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../components/BrandIcons';
import { useResumeStore } from '../../store/useResumeStore';
import GlassCard from '../../components/GlassCard';

export const CandidateCard: React.FC = () => {
  const { candidateInfo, extractionProgress } = useResumeStore();

  if (extractionProgress.stage !== 'success' || !candidateInfo) return null;

  const {
    name,
    email,
    phone,
    linkedin,
    github,
    portfolio,
    skills,
    education,
    experience,
    certifications,
  } = candidateInfo;

  // Get Initials for Avatar
  const getInitials = (fullName: string | null) => {
    if (!fullName) return 'IQ';
    return fullName
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <GlassCard className="border-[var(--border-premium)]" glow>
        <div className="space-y-8">
          
          {/* Header section with initials profile photo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-[var(--border-premium)]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[var(--primary-base)] to-[var(--secondary-base)] flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-xl shadow-indigo-500/10 flex-shrink-0">
              {getInitials(name)}
            </div>

            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                {name || 'Parsed Profile'}
              </h2>
              
              {/* Contact Information Pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[var(--border-premium)] bg-[var(--bg-app)]/50 hover:bg-[var(--primary-base)]/5 hover:border-[var(--primary-base)]/20 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{email}</span>
                  </a>
                )}
                
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[var(--border-premium)] bg-[var(--bg-app)]/50 hover:bg-[var(--primary-base)]/5 hover:border-[var(--primary-base)]/20 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{phone}</span>
                  </a>
                )}

                {linkedin && (
                  <a
                    href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[var(--border-premium)] bg-[var(--bg-app)]/50 hover:bg-sky-500/10 hover:border-sky-500/20 text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                  </a>
                )}

                {github && (
                  <a
                    href={github.startsWith('http') ? github : `https://${github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[var(--border-premium)] bg-[var(--bg-app)]/50 hover:bg-slate-950/10 dark:hover:bg-white/10 hover:border-slate-500/20 text-slate-600 dark:text-slate-300 transition-colors"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                )}

                {portfolio && (
                  <a
                    href={portfolio.startsWith('http') ? portfolio : `https://${portfolio}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border border-[var(--border-premium)] bg-[var(--bg-app)]/50 hover:bg-[var(--secondary-base)]/10 hover:border-[var(--secondary-base)]/20 text-slate-600 dark:text-slate-300 hover:text-[var(--secondary-base)] transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Portfolio</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Skills & Certifications */}
            <div className="space-y-6 lg:col-span-1">
              
              {/* Skills Card list */}
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
                  <Code className="w-4 h-4 text-[var(--primary-base)]" />
                  <h3 className="text-sm font-extrabold tracking-tight">Core Competencies</h3>
                </div>
                {skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 text-xs rounded-lg bg-[var(--primary-base)]/5 text-[var(--primary-base)] font-bold border border-[var(--primary-base)]/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No matching tech skills detected.</p>
                )}
              </div>

              {/* Certifications Card list */}
              {certifications.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-[var(--border-premium)] text-left">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
                    <Award className="w-4 h-4 text-[var(--secondary-base)]" />
                    <h3 className="text-sm font-extrabold tracking-tight">Credentials & Certs</h3>
                  </div>
                  <div className="flex flex-col space-y-1.5 pt-1.5">
                    {certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-[var(--secondary-base)] flex-shrink-0 mt-0.5" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Experience & Education */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Professional Experience */}
              <div className="space-y-5 text-left">
                <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
                  <Briefcase className="w-4 h-4 text-[var(--primary-base)]" />
                  <h3 className="text-sm font-extrabold tracking-tight">Professional History</h3>
                </div>
                
                {experience.length > 0 ? (
                  <div className="relative pl-4 border-l border-[var(--border-premium)] space-y-6">
                    {experience.map((exp, idx) => (
                      <div key={idx} className="relative space-y-1.5">
                        {/* Timeline bubble */}
                        <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-[var(--primary-base)] border border-[var(--bg-surface)] ring-4 ring-[var(--primary-base)]/10" />

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                            {exp.role}
                          </h4>
                          <span className="text-[10px] sm:text-xs font-mono font-bold text-slate-500 bg-[var(--bg-app)]/55 px-2 py-0.5 rounded-md border border-[var(--border-premium)]">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[var(--primary-base)]/80">
                          {exp.company}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No job experience detected.</p>
                )}
              </div>

              {/* Education Block */}
              {education.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-[var(--border-premium)] text-left">
                  <div className="flex items-center space-x-2 text-slate-800 dark:text-white">
                    <GraduationCap className="w-4 h-4 text-[var(--secondary-base)]" />
                    <h3 className="text-sm font-extrabold tracking-tight">Education</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-[var(--border-premium)] bg-[var(--bg-app)]/30 space-y-1"
                      >
                        <div className="flex justify-between items-start text-xs font-extrabold">
                          <h4 className="text-slate-800 dark:text-white leading-tight">
                            {edu.degree}
                          </h4>
                          {edu.year && (
                            <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 pl-2">
                              {edu.year}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500">
                          {edu.institution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </GlassCard>
    </motion.div>
  );
};
export default CandidateCard;
