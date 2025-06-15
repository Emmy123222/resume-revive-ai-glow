
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, FileText, MessageSquare, CheckCircle } from 'lucide-react';

interface AIProcessorProps {
  resume: string;
  jobDescription: string;
  onComplete: (tailoredResume: string, coverLetter: string, interviewQuestions: Array<{question: string, answer: string}>) => void;
}

const AIProcessor = ({ resume, jobDescription, onComplete }: AIProcessorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(true);

  const processingSteps = [
    {
      icon: Brain,
      title: "Analyzing Job Requirements",
      description: "Extracting key skills, qualifications, and keywords from the job posting"
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

  useEffect(() => {
    const processResume = async () => {
      // Simulate AI processing with realistic timing
      const stepDurations = [2000, 3000, 2500, 2000];
      
      for (let i = 0; i < processingSteps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, stepDurations[i]));
      }

      // Generate mock results (in a real app, this would call OpenAI API)
      const tailoredResume = generateTailoredResume(resume, jobDescription);
      const coverLetter = generateCoverLetter(resume, jobDescription);
      const interviewQuestions = generateInterviewQuestions(jobDescription);

      setIsProcessing(false);
      setTimeout(() => {
        onComplete(tailoredResume, coverLetter, interviewQuestions);
      }, 1000);
    };

    processResume();
  }, [resume, jobDescription, onComplete]);

  const generateTailoredResume = (originalResume: string, jobDesc: string): string => {
    // This is a mock implementation - in production, you'd use GPT-4
    const keywords = ['React', 'TypeScript', 'Python', 'Leadership', 'Agile', 'CI/CD'];
    let tailored = originalResume;
    
    // Add some mock enhancements
    tailored = tailored.replace(/Software Engineer/g, 'Senior Software Engineer');
    tailored += '\n\n• Enhanced application performance by implementing modern React patterns and TypeScript best practices';
    tailored += '\n• Led cross-functional team of 5 developers in Agile environment, delivering projects 20% ahead of schedule';
    
    return tailored;
  };

  const generateCoverLetter = (resume: string, jobDesc: string): string => {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the position at your company. After reviewing the job description, I am excited about the opportunity to contribute to your team's success.

With my background in software development and proven track record of delivering high-quality solutions, I am confident I would be a valuable addition to your organization. My experience includes:

• Developing scalable web applications using modern frameworks
• Leading technical projects and mentoring junior developers  
• Collaborating with cross-functional teams to deliver exceptional user experiences

I am particularly drawn to this role because it aligns perfectly with my passion for innovative technology solutions and my desire to work in a collaborative environment.

I would welcome the opportunity to discuss how my skills and enthusiasm can contribute to your team's continued success.

Thank you for your consideration.

Best regards,
[Your Name]`;
  };

  const generateInterviewQuestions = (jobDesc: string): Array<{question: string, answer: string}> => {
    return [
      {
        question: "Tell me about yourself and your relevant experience.",
        answer: "I'm a passionate software engineer with 5+ years of experience building scalable web applications. I've worked with modern technologies like React, TypeScript, and Python, and I'm particularly skilled at collaborating with cross-functional teams to deliver high-quality products that meet both technical and business requirements."
      },
      {
        question: "Why are you interested in this position and our company?",
        answer: "I'm excited about this opportunity because it combines my technical expertise with my passion for innovation. Your company's commitment to cutting-edge technology and collaborative culture aligns perfectly with my career goals. I'm particularly interested in how I can contribute to your team's mission of delivering exceptional user experiences."
      },
      {
        question: "Describe a challenging project you've worked on and how you overcame obstacles.",
        answer: "I recently led a project to migrate a legacy system to a modern architecture. The main challenge was maintaining system uptime while implementing significant changes. I created a phased migration plan, implemented comprehensive testing, and coordinated closely with stakeholders. The project was completed on time with zero downtime and resulted in 40% improved performance."
      },
      {
        question: "How do you stay current with new technologies and industry trends?",
        answer: "I'm committed to continuous learning through multiple channels: I follow industry blogs and newsletters, participate in online communities, attend conferences when possible, and work on personal projects to experiment with new technologies. I also believe in sharing knowledge with my team through tech talks and code reviews."
      },
      {
        question: "Do you have any questions for us?",
        answer: "Yes, I'd love to learn more about the team dynamics and collaboration style. What does a typical day look like for someone in this role? Also, what are the biggest challenges the team is currently facing, and how would this position help address them?"
      }
    ];
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <Sparkles className="w-20 h-20 text-purple-400" />
          </motion.div>
          <motion.div
            className="absolute inset-0 w-20 h-20 mx-auto rounded-full bg-purple-500/20 blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">AI is Working Its Magic</h2>
        <p className="text-gray-300 text-lg">
          Our AI is analyzing your resume and tailoring it for the perfect match
        </p>
      </motion.div>

      <div className="space-y-6">
        {processingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep || !isProcessing;
          
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
                <motion.div
                  animate={isActive ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </div>
              
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${
                  isActive ? 'text-purple-300' : isCompleted ? 'text-green-300' : 'text-gray-300'
                }`}>
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {step.description}
                </p>
              </div>

              {isActive && (
                <motion.div
                  className="flex space-x-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-2 h-2 bg-purple-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: dot * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              )}

              {isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400"
                >
                  <CheckCircle className="w-5 h-5" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {!isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-8"
        >
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-300 mb-2">
              Processing Complete!
            </h3>
            <p className="text-gray-300">
              Your tailored resume, cover letter, and interview prep are ready
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AIProcessor;
