
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface JobDescriptionInputProps {
  onSubmit: (jobDescription: string) => void;
}

const JobDescriptionInput = ({ onSubmit }: JobDescriptionInputProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');

  const handleSubmit = () => {
    if (jobDescription.trim()) {
      const fullJobDesc = `Job Title: ${jobTitle}\nCompany: ${companyName}\n\n${jobDescription}`;
      onSubmit(fullJobDesc);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Briefcase className="w-16 h-16 mx-auto mb-4 text-purple-400" />
        <h2 className="text-3xl font-bold text-white mb-4">Job Description</h2>
        <p className="text-gray-300 text-lg">
          Paste the job posting you're applying for so we can tailor your resume perfectly
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8"
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Title
            </label>
            <Input
              type="text"
              placeholder="e.g. Senior Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Name
            </label>
            <Input
              type="text"
              placeholder="e.g. TechCorp Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="bg-slate-900/50 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Description *
          </label>
          <Textarea
            placeholder="Paste the complete job description here. Include responsibilities, requirements, qualifications, and any other relevant information..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[300px] bg-slate-900/50 border-slate-600 text-white placeholder-gray-400 resize-none"
          />
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <h4 className="text-blue-300 font-medium mb-2">💡 Pro Tip</h4>
          <p className="text-blue-100 text-sm">
            The more detailed the job description, the better we can tailor your resume. 
            Include keywords, required skills, and company culture information for best results.
          </p>
        </div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!jobDescription.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze & Tailor
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDescriptionInput;
