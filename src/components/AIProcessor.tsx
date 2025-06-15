import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, FileText, MessageSquare, CheckCircle, AlertTriangle } from 'lucide-react';
import { callOpenAI, createResumePrompt, createCoverLetterPrompt, createInterviewQuestionsPrompt } from '../utils/openai';
import { Button } from '@/components/ui/button';

interface AIProcessorProps {
  resume: string;
  jobDescription: string;
  onComplete: (tailoredResume: string, coverLetter: string, interviewQuestions: Array<{ question: string, answer: string }>) => void;
  onError: (error: string) => void;
}

const AIProcessor = ({ resume, jobDescription, onComplete, onError }: AIProcessorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processingSteps = [
    {
      icon: Brain,
      title: "Analyzing Job Requirements",
      description: "AI is extracting key skills, qualifications, and keywords from the job posting"
    },
    {
      icon: FileText,
      title: "Tailoring Resume",
      description: "Optimizing your resume to match the job requirements and ATS keywords"
    },
    {
      icon: MessageSquare,
      title: "Generating Cover Letter",
      description: "Creating a personalized cover letter that highlights your relevant experience"
    },
    {
      icon: CheckCircle,
      title: "Preparing Interview Questions",
      description: "Generating likely interview questions with personalized answers"
    }
  ];

  // Delay helper between calls
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    const processWithAI = async () => {
      try {
        console.log('Starting AI processing...');
        setCurrentStep(0);
        await delay(2000); // UX-only fake "Analyzing"

        // Step 1: Tailor Resume
        setCurrentStep(1);
        console.log('Tailoring resume...');
        const resumePrompt = createResumePrompt(resume, jobDescription);
        const tailoredResume = await callOpenAI(resumePrompt);
        console.log('Resume tailored successfully');

        await delay(1500); // help avoid rate limits

        // Step 2: Generate Cover Letter
        setCurrentStep(2);
        console.log('Generating cover letter...');
        const coverLetterPrompt = createCoverLetterPrompt(resume, jobDescription);
        const coverLetter = await callOpenAI(coverLetterPrompt);
        console.log('Cover letter generated successfully');

        await delay(1500); // help avoid rate limits

        // Step 3: Generate Interview Questions
        setCurrentStep(3);
        console.log('Generating interview questions...');
        const questionsPrompt = createInterviewQuestionsPrompt(jobDescription, resume);
        const questionsResponse = await callOpenAI(questionsPrompt);

        let interviewQuestions;
        try {
          interviewQuestions = JSON.parse(questionsResponse);
        } catch (parseError) {
          console.warn('Failed to parse AI response as JSON. Using fallback.');
          interviewQuestions = [
            {
              question: "Tell me about yourself and your relevant experience.",
              answer: "Based on your resume, highlight your key experiences that align with this role."
            },
            {
              question: "Why are you interested in this position?",
              answer: "Express genuine interest in the role and company based on the job description."
            }
          ];
        }

        console.log('Interview questions generated successfully');
        setIsProcessing(false);

        setTimeout(() => {
          onComplete(tailoredResume, coverLetter, interviewQuestions);
        }, 1000);

      } catch (err: any) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        console.error('AI processing error:', message);
        setError(message);
        setIsProcessing(false);
        onError(message);
      }
    };

    processWithAI();
  }, [resume, jobDescription, onComplete, onError]);

  const retry = () => {
    setError(null);
    setCurrentStep(0);
    setIsProcessing(true);
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-white mb-4">Processing Failed</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={retry} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="relative">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="w-20 h-20 mx-auto mb-6">
            <Sparkles className="w-20 h-20 text-purple-400" />
          </motion.div>
          <motion.div className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-purple-500/20 blur-xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">AI is Working Its Magic</h2>
        <p className="text-gray-300 text-lg">Real AI is analyzing your resume and tailoring it for the perfect match</p>
      </motion.div>

      <div className="space-y-6">
        {processingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep || (!isProcessing && !error);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-6 rounded-xl border transition-all duration-500 ${
                isActive
                  ? 'bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-500/10'
                  : isCompleted
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-slate-800/30 border-slate-700'
              }`}
            >
              <div className={`p-3 rounded-full ${
                isActive
                  ? 'bg-purple-500/20 text-purple-400'
                  : isCompleted
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-slate-700 text-gray-400'
              }`}>
                <motion.div animate={isActive ? { rotate: [0, 360] } : {}} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>

              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  isActive ? 'text-purple-300' : isCompleted ? 'text-green-300' : 'text-gray-300'
                }`}>
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>

              {isActive && (
                <motion.div className="flex space-x-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {[0, 1, 2].map((dot) => (
                    <motion.div key={dot} className="w-2 h-2 bg-purple-400 rounded-full" animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1, repeat: Infinity, delay: dot * 0.2 }} />
                  ))}
                </motion.div>
              )}

              {isCompleted && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-400">
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!isProcessing && !error && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-8">
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-300 mb-2">AI Processing Complete!</h3>
            <p className="text-gray-300">Your tailored resume, cover letter, and interview prep are ready</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIProcessor;
