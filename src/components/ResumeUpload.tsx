
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ResumeUploadProps {
  onUpload: (resume: string) => void;
}

const ResumeUpload = ({ onUpload }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'drag' | 'paste' | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
        setUploadMethod('drag');
      };
      reader.readAsText(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
        setUploadMethod('drag');
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    if (resumeText.trim()) {
      onUpload(resumeText);
    }
  };

  const resetUpload = () => {
    setResumeText('');
    setFileName('');
    setUploadMethod(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Upload Your Resume</h2>
        <p className="text-gray-300 text-lg">
          Upload your current resume or paste the text to get started
        </p>
      </motion.div>

      {!uploadMethod && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Drag and Drop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive
                  ? 'border-purple-400 bg-purple-500/10 shadow-lg shadow-purple-500/25'
                  : 'border-gray-600 hover:border-purple-500 hover:bg-purple-500/5'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <motion.div
                animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className={`w-12 h-12 mx-auto mb-4 ${
                  dragActive ? 'text-purple-400' : 'text-gray-400'
                }`} />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drop your resume here
                </h3>
                <p className="text-gray-400 mb-4">
                  or click to browse files
                </p>
                <p className="text-sm text-gray-500">
                  Supports .txt files for now
                </p>
              </motion.div>
              <input
                id="file-input"
                type="file"
                accept=".txt"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </motion.div>

          {/* Paste Text */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/5 transition-all duration-300"
              onClick={() => setUploadMethod('paste')}
            >
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Paste resume text
              </h3>
              <p className="text-gray-400 mb-4">
                Copy and paste your resume content
              </p>
              <p className="text-sm text-gray-500">
                Perfect for quick edits
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {uploadMethod === 'paste' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Paste Your Resume</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetUpload}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Textarea
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[300px] bg-slate-900/50 border-slate-600 text-white placeholder-gray-400 resize-none"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSubmit}
                disabled={!resumeText.trim()}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {uploadMethod === 'drag' && resumeText && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Resume Uploaded</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetUpload}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-purple-400" />
              <span className="text-gray-300">{fileName}</span>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto mb-4">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">{resumeText}</pre>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUpload;
