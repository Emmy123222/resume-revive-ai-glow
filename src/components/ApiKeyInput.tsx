
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ApiKeyInputProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyInput = ({ onApiKeySubmit }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('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');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey);
      onApiKeySubmit(apiKey);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Key className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
        <h2 className="text-3xl font-bold text-white mb-4">OpenAI API Key Required</h2>
        <p className="text-gray-300 text-lg">
          Enter your OpenAI API key to enable real AI processing
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-8"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              OpenAI API Key
            </label>
            <div className="relative">
              <Input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-slate-900/50 border-slate-600 text-white placeholder-gray-400 pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-300 font-medium mb-2">🔒 Privacy Notice</h4>
            <p className="text-blue-100 text-sm">
              Your API key is stored locally in your browser and never sent to our servers. 
              It's only used to make direct requests to OpenAI's API.
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <h4 className="text-yellow-300 font-medium mb-2">💡 How to get an API key</h4>
            <p className="text-yellow-100 text-sm mb-2">
              1. Go to platform.openai.com<br/>
              2. Sign up or log in to your account<br/>
              3. Navigate to API Keys section<br/>
              4. Create a new secret key
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!apiKey.trim()}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
          >
            Continue with Real AI
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ApiKeyInput;
