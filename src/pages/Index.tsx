import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Briefcase, MessageSquare, Download, Sparkles } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import JobDescriptionInput from '../components/JobDescriptionInput';
import AIProcessor from '../components/AIProcessor';
import ResultsDisplay from '../components/ResultsDisplay';
import InterviewPrep from '../components/InterviewPrep';
import AnimatedBackground from '../components/AnimatedBackground';
import ApiKeyInput from '../components/ApiKeyInput';

type Step = 'apikey' | 'upload' | 'jobdesc' | 'processing' | 'results' | 'interview';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('apikey');
  const [apiKey, setApiKey] = useState<string>('');
  const [resumeData, setResumeData] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [tailoredResume, setTailoredResume] = useState<string>('');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [interviewQuestions, setInterviewQuestions] = useState<Array<{question: string, answer: string}>>([]);

  // Check for existing API key on load
  useEffect(() => {
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setCurrentStep('upload');
    }
  }, []);

  const steps = [
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'jobdesc', label: 'Job Description', icon: Briefcase },
    { id: 'processing', label: 'AI Processing', icon: Sparkles },
    { id: 'results', label: 'Tailored Results', icon: FileText },
    { id: 'interview', label: 'Interview Prep', icon: MessageSquare },
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    setCurrentStep('upload');
  };

  const handleResumeUpload = (resume: string) => {
    setResumeData(resume);
    setCurrentStep('jobdesc');
  };

  const handleJobDescSubmit = (jobDesc: string) => {
    setJobDescription(jobDesc);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (tailored: string, cover: string, questions: Array<{question: string, answer: string}>) => {
    setTailoredResume(tailored);
    setCoverLetter(cover);
    setInterviewQuestions(questions);
    setCurrentStep('results');
  };

  const handleProcessingError = (error: string) => {
    console.error('Processing error:', error);
    // Could show error state or go back to previous step
    setCurrentStep('jobdesc');
  };

  const goToInterviewPrep = () => {
    setCurrentStep('interview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Header */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-4">
              Resume Reviver
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real AI Career Assistant for Tailored Resumes, Cover Letters & Interview Prep
            </p>
          </motion.div>

          {/* Progress Bar - hide for API key step */}
          {currentStep !== 'apikey' && (
            <div className="max-w-4xl mx-auto mb-12">
              {/* ... keep existing code (progress bar) */}
              <div className="flex items-center justify-between relative">
                <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-700"></div>
                <motion.div
                  className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep;
                  const isCompleted = getCurrentStepIndex() > index;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                      <motion.div
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
                            : isCompleted
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                            : 'bg-gray-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>
                      <span className={`text-sm font-medium ${
                        isActive ? 'text-purple-300' : isCompleted ? 'text-green-300' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          {currentStep === 'apikey' && (
            <motion.div
              key="apikey"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
            </motion.div>
          )}

          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ResumeUpload onUpload={handleResumeUpload} />
            </motion.div>
          )}

          {currentStep === 'jobdesc' && (
            <motion.div
              key="jobdesc"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <JobDescriptionInput onSubmit={handleJobDescSubmit} />
            </motion.div>
          )}

          {currentStep === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <AIProcessor
                resume={resumeData}
                jobDescription={jobDescription}
                apiKey={apiKey}
                onComplete={handleProcessingComplete}
                onError={handleProcessingError}
              />
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsDisplay
                originalResume={resumeData}
                tailoredResume={tailoredResume}
                coverLetter={coverLetter}
                onInterviewPrep={goToInterviewPrep}
              />
            </motion.div>
          )}

          {currentStep === 'interview' && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <InterviewPrep
                questions={interviewQuestions}
                jobDescription={jobDescription}
                resume={tailoredResume}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
