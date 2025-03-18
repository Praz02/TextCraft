'use client';

import { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useUser } from '@clerk/nextjs';
import { getUserTemplates } from '@/utils/templates';
import { useEffect } from 'react';
import { Template } from '@/utils/supabase';
import EmailModal from '@/components/EmailModal';
import DeepSeekTuner from '@/components/DeepSeekTuner';
import ContentQualityMonitor from '@/components/ContentQualityMonitor';

export default function GenerateTextPage() {
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [model, setModel] = useState('deepseek-reasoner');
  const [systemPrompt, setSystemPrompt] = useState('You are a skilled content writer who creates engaging, accurate, and well-structured content.');
  const [temperature, setTemperature] = useState(0.7);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [provider, setProvider] = useState('deepseek');
  const [maxTokens, setMaxTokens] = useState('500');
  const [title, setTitle] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [emailError, setEmailError] = useState('');

  // Fetch user templates when the user is loaded
  useEffect(() => {
    async function loadTemplates() {
      if (user) {
        setIsLoadingTemplates(true);
        try {
          const userTemplates = await getUserTemplates(user.id);
          setTemplates(userTemplates);
        } catch (error) {
          console.error('Error loading templates:', error);
        } finally {
          setIsLoadingTemplates(false);
        }
      }
    }

    if (isLoaded && user) {
      loadTemplates();
    }
  }, [user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setErrorMessage('Please enter a prompt');
      return;
    }
    
    setIsSubmitting(true);
    setGeneratedText('');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/generateText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          template: selectedTemplate || null,
          contentType,
          tone,
          length,
          options: {
            model,
            provider,
            systemPrompt,
            temperature: parseFloat(temperature.toString()),
            maxTokens: parseInt(maxTokens.toString()),
            title: title || 'Generated Text',
            contentType,
            tone,
            length,
          },
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate text');
      }
      
      setGeneratedText(data.generatedText);
    } catch (error) {
      console.error('Error generating text:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatedText)
      .then(() => {
        alert('Text copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const handleEmailContent = async (to: string, subject: string) => {
    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          content: generatedText,
          title: title || 'Generated Text',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
      
      setEmailStatus('success');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailError(error instanceof Error ? error.message : 'An error occurred');
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 3000);
      throw error;
    }
  };

  return (
    <MainLayout>
      <div className="py-16 mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem' }}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Generate Text</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Use our AI-powered text generation tools to create high-quality content in seconds.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Input form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template selection */}
              <div>
                <label htmlFor="template" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Template (Optional)
                </label>
                <select 
                  id="template"
                  className="input"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  disabled={isLoadingTemplates}
                >
                  <option value="">No template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.title}
                    </option>
                  ))}
                </select>
                {isLoadingTemplates && <p className="text-sm text-gray-500 mt-1">Loading templates...</p>}
              </div>

              {/* Content Type */}
              <div>
                <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content Type
                </label>
                <select 
                  id="content-type"
                  className="input"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                >
                  <option value="blog-post">Blog Post</option>
                  <option value="social-media">Social Media Post</option>
                  <option value="email">Email</option>
                  <option value="ad-copy">Ad Copy</option>
                  <option value="product-description">Product Description</option>
                </select>
              </div>
              
              {/* Prompt */}
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prompt
                </label>
                <textarea 
                  id="prompt"
                  className="input min-h-[120px]" 
                  placeholder="Describe what you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                />
                
                {/* Add DeepSeekTuner here */}
                {provider === 'deepseek' && prompt.trim().length > 10 && (
                  <DeepSeekTuner 
                    onPromptUpdate={(improvedPrompt) => setPrompt(improvedPrompt)}
                    originalPrompt={prompt}
                    contentType={contentType}
                  />
                )}
              </div>
              
              {/* Tone */}
              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tone
                </label>
                <select 
                  id="tone"
                  className="input"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="enthusiastic">Enthusiastic</option>
                  <option value="humorous">Humorous</option>
                </select>
              </div>
              
              {/* Length */}
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Length
                </label>
                <select 
                  id="length"
                  className="input"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                >
                  <option value="short">Short (100-200 words)</option>
                  <option value="medium">Medium (300-500 words)</option>
                  <option value="long">Long (600-1000 words)</option>
                </select>
              </div>

              {/* Advanced Settings Toggle */}
              <div>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      Hide Advanced Settings
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      Show Advanced Settings
                    </>
                  )}
                </button>
              </div>

              {/* Advanced Settings */}
              {showAdvanced && (
                <div className="space-y-4 pt-1 pb-2 border-t border-gray-200 dark:border-gray-700">
                  {/* Model Selection */}
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      AI Model
                    </label>
                    <select
                      id="model"
                      className="input"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                    >
                      <option value="deepseek-reasoner">DeepSeek Reasoner</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Different models offer varying capabilities and costs.
                    </p>
                  </div>
                  
                  {/* Provider Selection */}
                  <div>
                    <label htmlFor="provider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      API Provider
                    </label>
                    <select
                      id="provider"
                      className="input"
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                    >
                      <option value="deepseek">DeepSeek (Default)</option>
                      <option value="openai">OpenAI</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Select which AI provider to use for text generation.
                    </p>
                  </div>
                  
                  {/* System Prompt */}
                  <div>
                    <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      System Prompt
                    </label>
                    <textarea
                      id="system-prompt"
                      className="input min-h-[80px]"
                      placeholder="Instructions for the AI model..."
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Customize how the AI behaves when generating your content.
                    </p>
                  </div>
                  
                  {/* Temperature Slider */}
                  <div>
                    <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Temperature: {temperature}
                    </label>
                    <input
                      type="range"
                      id="temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Controls randomness: Higher values (1.0) make output more random, lower values (0.0) make it more deterministic.
                    </p>
                  </div>

                  {/* Max Tokens Input */}
                  <div>
                    <label htmlFor="max-tokens" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      id="max-tokens"
                      min="1"
                      max="8192"
                      value={maxTokens}
                      onChange={(e) => setMaxTokens(e.target.value)}
                      className="input"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum number of tokens to generate. Higher values allow for longer responses.
                    </p>
                  </div>

                  {/* Title Field */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Save As
                    </label>
                    <input
                      type="text"
                      id="title"
                      placeholder="Title for saved text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              )}
              
              {errorMessage && (
                <div className="text-red-500 text-sm py-2">
                  {errorMessage}
                </div>
              )}
              
              <button 
                type="submit" 
                className="btn btn-primary w-full py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : 'Generate Content'}
              </button>
            </form>
          </div>
          
          {/* Output area */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Generated Content</h2>
              {generatedText && (
                <button 
                  onClick={handleCopyText}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </button>
              )}
            </div>
            
            <div className="min-h-[400px] p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-auto">
              {isSubmitting ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="flex justify-center">
                      <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-4 py-1">
                          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">
                      Generating your content...
                    </p>
                  </div>
                </div>
              ) : generatedText ? (
                <div className="whitespace-pre-wrap">{generatedText}</div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 h-full flex items-center justify-center">
                  Generated content will appear here...
                </p>
              )}
            </div>
            
            {generatedText && (
              <div className="mt-4 flex space-x-3">
                <button 
                  onClick={handleCopyText}
                  className="btn btn-outline"
                >
                  Copy to Clipboard
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => setGeneratedText('')}
                >
                  Clear
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsEmailModalOpen(true)}
                >
                  Email Content
                </button>
              </div>
            )}
            
            {/* Add ContentQualityMonitor here */}
            {generatedText && (
              <ContentQualityMonitor 
                generatedText={generatedText}
                contentType={contentType}
              />
            )}
          </div>
        </div>
      </div>
      
      <EmailModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSend={handleEmailContent}
        title={title || 'Generated Text'}
        content={generatedText}
      />
    </MainLayout>
  );
} 