import { useState } from 'react';

interface DeepSeekTunerProps {
  onPromptUpdate: (improvedPrompt: string) => void;
  originalPrompt: string;
  contentType: string;
}

export default function DeepSeekTuner({ onPromptUpdate, originalPrompt, contentType }: DeepSeekTunerProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);
  const [optimizationError, setOptimizationError] = useState('');

  // Enhances a prompt for better AI generation results
  const enhancePrompt = async () => {
    if (!originalPrompt?.trim()) return;
    
    setIsOptimizing(true);
    setOptimizationComplete(false);
    setOptimizationError('');
    
    try {
      // Content type specific enhancements
      let enhancedPrompt = originalPrompt;
      
      // Craft context-rich prompts that help the model understand what's needed
      if (contentType === 'blog-post') {
        // For blog posts, ensure we have clear structure and research guidelines
        if (!enhancedPrompt.toLowerCase().includes('research') && 
            !enhancedPrompt.toLowerCase().includes('sources')) {
          enhancedPrompt += ". Include well-researched information with key points backed by data when applicable.";
        }
        
        if (!enhancedPrompt.toLowerCase().includes('structure') && 
            !enhancedPrompt.toLowerCase().includes('format')) {
          enhancedPrompt += " Structure with clear introduction, main sections with subheadings, and a conclusion.";
        }
      } 
      else if (contentType === 'social-media') {
        // For social media, emphasize brevity and engagement
        if (!enhancedPrompt.toLowerCase().includes('engaging') && 
            !enhancedPrompt.toLowerCase().includes('attention')) {
          enhancedPrompt += " Make it attention-grabbing and engaging for social media.";
        }
        
        if (!enhancedPrompt.toLowerCase().includes('call to action') && 
            !enhancedPrompt.toLowerCase().includes('cta')) {
          enhancedPrompt += " Include a compelling call-to-action.";
        }
      }
      else if (contentType === 'ad-copy') {
        // For ads, focus on benefits and persuasion
        if (!enhancedPrompt.toLowerCase().includes('benefit') && 
            !enhancedPrompt.toLowerCase().includes('value')) {
          enhancedPrompt += " Emphasize key benefits and unique value proposition.";
        }
        
        if (!enhancedPrompt.toLowerCase().includes('persuasive') && 
            !enhancedPrompt.toLowerCase().includes('convincing')) {
          enhancedPrompt += " Make it persuasive and compelling to drive action.";
        }
      }
      
      // Add specific instruction to improve reasoning and reduce hallucination
      if (enhancedPrompt.indexOf("Please provide accurate information only") === -1) {
        enhancedPrompt += " Please provide accurate information only. If you're uncertain about a fact, focus on well-known information instead of speculation.";
      }
      
      // Simulate a short delay to make the enhancement feel substantial
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the parent component with the enhanced prompt
      onPromptUpdate(enhancedPrompt);
      setOptimizationComplete(true);
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      setOptimizationError('Failed to optimize prompt. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  if (optimizationComplete) {
    return (
      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-sm mb-4">
        <div className="flex items-center text-green-800 dark:text-green-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Prompt optimized for improved results!</span>
        </div>
        <p className="mt-1 text-green-700 dark:text-green-300 text-xs">
          Your prompt has been enhanced with specific details to help the AI generate better content.
        </p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md text-sm mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-blue-800 dark:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Optimize for DeepSeek Reasoner</span>
        </div>
        
        <button
          onClick={enhancePrompt}
          disabled={isOptimizing}
          className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
        >
          {isOptimizing ? 'Optimizing...' : 'Optimize Prompt'}
        </button>
      </div>
      
      <p className="mt-1 text-blue-700 dark:text-blue-300 text-xs">
        Enhance your prompt with specific details to get better results from the DeepSeek Reasoner model.
      </p>
      
      {optimizationError && (
        <p className="mt-2 text-red-600 dark:text-red-400 text-xs">
          {optimizationError}
        </p>
      )}
    </div>
  );
} 