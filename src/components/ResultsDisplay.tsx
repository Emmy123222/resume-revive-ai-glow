
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, MessageSquare, ArrowRight, Copy, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResultsDisplayProps {
  originalResume: string;
  tailoredResume: string;
  coverLetter: string;
  onInterviewPrep: () => void;
}

const ResultsDisplay = ({ originalResume, tailoredResume, coverLetter, onInterviewPrep }: ResultsDisplayProps) => {
  const [copiedResume, setCopiedResume] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);

  const copyToClipboard = async (text: string, type: 'resume' | 'letter') => {
    await navigator.clipboard.writeText(text);
    if (type === 'resume') {
      setCopiedResume(true);
      setTimeout(() => setCopiedResume(false), 2000);
    } else {
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    }
  };

  const downloadPDF = (content: string, filename: string) => {
    // In a real app, you'd convert to PDF
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Your Tailored Materials</h2>
        </div>
        <p className="text-gray-300 text-lg">
          Your resume has been optimized and your cover letter is ready to impress
        </p>
      </motion.div>

      <Tabs defaultValue="resume" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800/50">
          <TabsTrigger value="resume" className="text-white">
            <FileText className="w-4 h-4 mr-2" />
            Tailored Resume
          </TabsTrigger>
          <TabsTrigger value="cover-letter" className="text-white">
            <MessageSquare className="w-4 h-4 mr-2" />
            Cover Letter
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resume">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Original Resume */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-300">Original Resume</h3>
                <span className="text-sm text-gray-500">Before</span>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-gray-400 text-sm whitespace-pre-wrap">{originalResume}</pre>
              </div>
            </div>

            {/* Tailored Resume */}
            <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-purple-300">Tailored Resume</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-400">✨ Enhanced</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(tailoredResume, 'resume')}
                    className="text-purple-300 hover:text-purple-200"
                  >
                    {copiedResume ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 max-h-96 overflow-y-auto mb-4">
                <pre className="text-gray-200 text-sm whitespace-pre-wrap">{tailoredResume}</pre>
              </div>
              <Button
                onClick={() => downloadPDF(tailoredResume, 'tailored-resume')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="cover-letter">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5 backdrop-blur-sm rounded-xl border border-blue-500/20 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-blue-300">Your Cover Letter</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(coverLetter, 'letter')}
                  className="text-blue-300 hover:text-blue-200"
                >
                  {copiedLetter ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-6 mb-6">
                <pre className="text-gray-200 whitespace-pre-wrap leading-relaxed">{coverLetter}</pre>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => downloadPDF(coverLetter, 'cover-letter')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Cover Letter
                </Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-emerald-300 mb-4">Ready for the Interview?</h3>
          <p className="text-gray-300 mb-6">
            Get personalized interview questions and practice your answers with AI feedback
          </p>
          <Button
            onClick={onInterviewPrep}
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Start Interview Prep
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultsDisplay;
