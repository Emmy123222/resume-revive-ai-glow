
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mic, MicOff, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Question {
  question: string;
  answer: string;
}

interface InterviewPrepProps {
  questions: Question[];
  jobDescription: string;
  resume: string;
}

const InterviewPrep = ({ questions, jobDescription, resume }: InterviewPrepProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'read' | 'practice'>('read');

  const currentQuestion = questions[currentQuestionIndex];

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop audio recording
  };

  const resetPractice = () => {
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setIsRecording(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <MessageSquare className="w-16 h-16 mx-auto mb-4 text-emerald-400" />
        <h2 className="text-3xl font-bold text-white mb-4">Interview Preparation</h2>
        <p className="text-gray-300 text-lg">
          Practice with personalized questions based on the job requirements
        </p>
      </motion.div>

      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 p-1 rounded-lg">
          <Button
            variant={practiceMode === 'read' ? 'default' : 'ghost'}
            onClick={() => setPracticeMode('read')}
            className="mr-1"
          >
            Read & Review
          </Button>
          <Button
            variant={practiceMode === 'practice' ? 'default' : 'ghost'}
            onClick={() => setPracticeMode('practice')}
          >
            Voice Practice
          </Button>
        </div>
      </div>

      {/* Question Counter */}
      <div className="text-center mb-6">
        <span className="text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Main Content */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 p-8 mb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Question */}
            <div className="mb-8">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-emerald-400 font-semibold">Q</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {currentQuestion.question}
                  </h3>
                </div>
              </div>
            </div>

            {/* Practice Mode Controls */}
            {practiceMode === 'practice' && (
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Button
                    onClick={toggleRecording}
                    size="lg"
                    className={`${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-emerald-500 hover:bg-emerald-600'
                    } text-white px-8`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                </div>

                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <motion.div
                        className="w-3 h-3 bg-red-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-red-300 font-medium">Recording...</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Take your time and speak naturally. Click "Stop Recording" when you're done.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Answer Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-semibold">A</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white">Suggested Answer</h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="text-blue-300 hover:text-blue-200"
                >
                  {showAnswer ? 'Hide' : 'Show'} Answer
                </Button>
              </div>

              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4"
                  >
                    <p className="text-gray-200 leading-relaxed">
                      {currentQuestion.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tips */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Star className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-yellow-300 font-medium mb-1">💡 Interview Tip</h5>
                  <p className="text-yellow-100 text-sm">
                    Use the STAR method (Situation, Task, Action, Result) to structure your behavioral question responses. 
                    Be specific with examples and quantify your achievements when possible.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={resetPractice}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <Button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          variant="ghost"
          className="text-gray-400 hover:text-white"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center mt-8 gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentQuestionIndex(index);
              setShowAnswer(false);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentQuestionIndex
                ? 'bg-emerald-400 scale-125'
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Summary */}
      {currentQuestionIndex === questions.length - 1 && showAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-2">
              🎉 You've completed all questions!
            </h3>
            <p className="text-gray-300 mb-4">
              You're well-prepared for your interview. Remember to be confident and authentic.
            </p>
            <Button
              onClick={resetPractice}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
            >
              Practice Again
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewPrep;
