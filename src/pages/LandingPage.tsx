import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Layers, 
  SearchCode, 
  History,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../providers/ToastProvider';
import HeroIllustration from '../components/HeroIllustration';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import UploadCard from '../features/upload/UploadCard';
import ExtractionStatusCard from '../features/extraction/ExtractionStatusCard';
import CandidateCard from '../features/candidates/CandidateCard';
import JobDescriptionCard from '../features/jobs/JobDescriptionCard';
import ResultsDashboard from '../features/results/ResultsDashboard';

export const LandingPage: React.FC = () => {
  const { addToast } = useToast();
  const workspaceRef = useRef<HTMLDivElement>(null);

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleMockHistory = () => {
    addToast('Your upload history is stored in local storage and will load automatically on return.', 'info');
  };

  // Feature Card metadata
  const features = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: 'ATS Compatibility',
      desc: 'Verify layout styles and compliance checks with standard corporate screening filters.'
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      title: 'Job Match',
      desc: 'Align your qualifications with specific job roles to evaluate skill overlap ratios.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-500" />,
      title: 'Resume Recommendations',
      desc: 'Review structurally optimized section layouts to boost professional impact.'
    },
    {
      icon: <Layers className="w-5 h-5 text-violet-500" />,
      title: 'AI Suggestions',
      desc: 'Discover tailored bullet points and action-verb improvements to elevate your tone.'
    },
    {
      icon: <SearchCode className="w-5 h-5 text-amber-500" />,
      title: 'Keyword Detection',
      desc: 'Identify critical missing keywords and software tags to bypass initial scanner bots.'
    },
    {
      icon: <History className="w-5 h-5 text-rose-500" />,
      title: 'History Tracking',
      desc: 'Save and review previously extracted candidates and profiles entirely client-side.'
    }
  ];

  // Framer Motion staggered animation setups
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  } as const;

  return (
    <div className="w-full flex flex-col space-y-16 py-4">
      
      {/* 1. Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center lg:py-8"
      >
        
        {/* Left Col: Headings & CTA buttons */}
        <div className="lg:col-span-7 text-left space-y-6">
          
          {/* Top Label pill */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 px-3 py-1 rounded-full border border-indigo-500/20 shadow-sm shadow-indigo-500/5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-base)] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary-base)]">
              Next-Gen Application Optimizer
            </span>
          </div>

          {/* Huge Hero Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-800 dark:text-white leading-[1.08] lg:max-w-xl">
            Know Exactly Why Recruiters Say{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-base)] via-[var(--primary-light)] to-[var(--secondary-base)] drop-shadow-sm font-extrabold">
              Yes or No.
            </span>
          </h1>

          {/* Beautiful Subtitle */}
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            Analyze ATS compatibility, identify missing skills, discover keyword gaps and generate AI-powered resume recommendations.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3.5 pt-2">
            <CustomButton 
              variant="primary" 
              size="lg" 
              onClick={scrollToWorkspace}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Analyze Resume
            </CustomButton>
            
            <CustomButton 
              variant="secondary" 
              size="lg" 
              onClick={handleMockHistory}
              icon={<History className="w-4 h-4" />}
            >
              View Previous Analyses
            </CustomButton>
          </div>

        </div>

        {/* Right Col: Hero Animated Illustration */}
        <div className="lg:col-span-5 flex justify-center">
          <HeroIllustration />
        </div>

      </motion.section>

      {/* 2. Feature Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-100px' }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            Engineered for Job Matching Excellence
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
            Everything you need to optimize your candidate profile and secure interviews.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <GlassCard 
                hoverEffect 
                className="text-left space-y-3 border-[var(--border-premium)] h-full flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="p-2.5 bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/5 rounded-xl w-fit">
                    {feat.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-white tracking-tight">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {feat.desc}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 3. Main Action Workspace */}
      <div 
        ref={workspaceRef}
        className="space-y-8 pt-6 border-t border-[var(--border-premium)]"
      >
        
        {/* Section Header */}
        <div className="text-left space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
            Optimisation Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Upload your resume, enter the target job description details, and let the parser analyze requirements.
          </p>
        </div>

        {/* Workspace Dual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload Zone, Processing State, Candidate Profile Preview */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. File Upload zone */}
            <UploadCard />

            {/* 2. Live progress diagnostic */}
            <ExtractionStatusCard />

            {/* 3. Parsed Profile Card */}
            <CandidateCard />

          </div>

          {/* Right Column: Job description card input */}
          <div className="lg:col-span-5 h-full">
            <JobDescriptionCard />
          </div>

        </div>

        {/* Results Dashboard integration */}
        <ResultsDashboard />

      </div>

    </div>
  );
};
export default LandingPage;
