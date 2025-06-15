import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, X, Sparkles, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

// Set workerSrc to a verified CDN for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface ResumeUploadProps {
  onUpload: (resume: string) => void;
}

const ResumeUpload = ({ onUpload }: ResumeUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'drag' | 'paste' | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeImages, setResumeImages] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'text' | 'pdf' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const processFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage('File is too large. Please upload a file smaller than 5MB.');
      resetUpload();
      return;
    }

    console.log('Processing file:', file.name, file.type);
    setFileName(file.name);
    setErrorMessage(null);
    setIsLoading(true);

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isText = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

    try {
      if (isText) {
        setFileType('text');
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          if (text && text.trim()) {
            setResumeText(text);
            setUploadMethod('drag');
          } else {
            setErrorMessage('The text file appears to be empty. Please upload a file with content.');
            resetUpload();
          }
          setIsLoading(false);
        };
        reader.onerror = (error) => {
          console.error('Text file reading error:', error);
          setErrorMessage('Failed to read text file. Please ensure the file is valid.');
          resetUpload();
          setIsLoading(false);
        };
        reader.readAsText(file);
      } else if (isPDF) {
        setFileType('pdf');
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const typedArray = new Uint8Array(event.target?.result as ArrayBuffer);
            const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({ 
              data: typedArray,
              useSystemFonts: true
            }).promise;
            
            const images: string[] = [];
            let extractedText = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
              const page: PDFPageProxy = await pdf.getPage(pageNum);
              
              // Extract text for submission
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .filter(item => 'str' in item)
                .map(item => (item as { str: string }).str)
                .join(' ');
              extractedText += pageText + '\n\n';

              // Render page as image
              const viewport = page.getViewport({ scale: 1.5 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              if (context) {
                const renderContext = {
                  canvasContext: context,
                  viewport: viewport,
                };
                await page.render(renderContext).promise;
                const imageDataUrl = canvas.toDataURL('image/png');
                images.push(imageDataUrl);
              }
            }

            const cleanedText = extractedText.trim();
            if (cleanedText && images.length > 0) {
              setResumeText(cleanedText);
              setResumeImages(images);
              setUploadMethod('drag');
            } else {
              setErrorMessage('No content could be extracted from the PDF. Please ensure the PDF contains readable content.');
              resetUpload();
            }
            setIsLoading(false);
          } catch (err: any) {
            console.error('Error parsing PDF:', err);
            if (err.message && err.message.includes('Setting up fake worker failed')) {
              setErrorMessage('Failed to load PDF processing module. Please try again or use a text file.');
            } else if (err.message && err.message.includes('Invalid PDF')) {
              setErrorMessage('Invalid PDF file. Please ensure the file is a valid, non-encrypted PDF.');
            } else {
              setErrorMessage('Failed to parse PDF file. Please try a different PDF or use a text file.');
            }
            resetUpload();
            setIsLoading(false);
          }
        };
        reader.onerror = (error) => {
          console.error('PDF file reading error:', error);
          setErrorMessage('Failed to read PDF file. Please try another file.');
          resetUpload();
          setIsLoading(false);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrorMessage('Unsupported file format. Please upload a .txt or .pdf file.');
        resetUpload();
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setErrorMessage('An unexpected error occurred while processing the file. Please try again.');
      resetUpload();
      setIsLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      setErrorMessage('Please upload only one file at a time.');
      return;
    }
    const file = files[0];
    if (file) {
      processFile(file);
    } else {
      setErrorMessage('No valid file detected.');
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (resumeText.trim()) {
      onUpload(resumeText.trim());
      setErrorMessage(null);
    } else {
      setErrorMessage('No resume content to submit. Please upload or paste a resume.');
    }
  };

  const resetUpload = () => {
    setResumeText('');
    setResumeImages([]);
    setFileName('');
    setFileType(null);
    setUploadMethod(null);
    setErrorMessage(null);
    setIsLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
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

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-center"
        >
          {errorMessage}
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-blue-500/10 border border-blue-500 rounded-lg text-blue-400 text-center"
        >
          Processing your resume, please wait...
        </motion.div>
      )}

      {!uploadMethod && (
        <div className="grid md:grid-cols-2 gap-6">
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
              onClick={handleFileInputClick}
            >
              <motion.div
                animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload
                  className={`w-12 h-12 mx-auto mb-4 ${
                    dragActive ? 'text-purple-400' : 'text-gray-400'
                  }`}
                />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Drop your resume here
                </h3>
                <p className="text-gray-400 mb-4">or click to browse files</p>
                <p className="text-sm text-gray-500">Supports .txt and .pdf files (max 5MB)</p>
              </motion.div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </motion.div>

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
              <p className="text-gray-400 mb-4">Copy and paste your resume content</p>
              <p className="text-sm text-gray-500">Perfect for quick edits</p>
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
                disabled={!resumeText.trim() || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Continue
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {uploadMethod === 'drag' && (resumeText || resumeImages.length > 0) && (
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
              {fileType === 'pdf' ? (
                <Image className="w-5 h-5 text-purple-400" />
              ) : (
                <FileText className="w-5 h-5 text-purple-400" />
              )}
              <span className="text-gray-300">{fileName}</span>
              <span className="text-xs text-gray-500 bg-slate-700 px-2 py-1 rounded">
                {fileType?.toUpperCase()}
              </span>
            </div>
            
            {fileType === 'pdf' && resumeImages.length > 0 ? (
              <div className="space-y-4 mb-4">
                <h4 className="text-sm font-medium text-gray-300">Resume Preview:</h4>
                <div className="bg-slate-900/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-4">
                    {resumeImages.map((image, index) => (
                      <div key={index} className="border border-slate-600 rounded-lg overflow-hidden">
                        <div className="text-xs text-gray-400 bg-slate-700 px-3 py-1">
                          Page {index + 1}
                        </div>
                        <img 
                          src={image} 
                          alt={`Resume page ${index + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : fileType === 'text' && resumeText ? (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Resume Content:</h4>
                <div className="bg-slate-900/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">{resumeText}</pre>
                </div>
              </div>
            ) : null}
            
            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
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