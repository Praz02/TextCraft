'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  getUserProfileByClerkId, 
  createTemplate, 
  getUserTemplates,
  createGeneratedText,
  getUserGeneratedTexts
} from '@/utils/db';
import { Template, GeneratedText, UserProfile } from '@/utils/supabase';

export default function SupabaseTest() {
  const { user } = useUser();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [generatedTexts, setGeneratedTexts] = useState<GeneratedText[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null);
  const [testMessage, setTestMessage] = useState<string>('');

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    async function fetchUserData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch user profile
        const userProfile = await getUserProfileByClerkId(user?.id as string);
        if (!userProfile) {
          setError('User profile not found. Make sure the Clerk webhook is configured correctly.');
          setIsLoading(false);
          return;
        }
        
        setProfile(userProfile);
        
        // Fetch user templates
        const fetchedTemplates = await getUserTemplates(userProfile.id);
        setTemplates(fetchedTemplates);
        
        // Fetch generated texts
        const fetchedGeneratedTexts = await getUserGeneratedTexts(userProfile.id);
        setGeneratedTexts(fetchedGeneratedTexts);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('An error occurred while fetching data');
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [user]);

  const runTestOperations = async () => {
    if (!profile) {
      setTestMessage('Cannot run test: User profile not found');
      setTestSuccess(false);
      return;
    }

    try {
      setTestMessage('Running test operations...');
      
      // Test creating a template
      const testTemplate = await createTemplate({
        user_id: profile.id,
        title: `Test Template ${new Date().toISOString()}`,
        description: 'This is a test template',
        content: 'This is a test template content created to verify Supabase connection.',
        is_public: false
      });
      
      if (!testTemplate) {
        throw new Error('Failed to create test template');
      }
      
      // Test creating a generated text
      const testGeneratedText = await createGeneratedText({
        user_id: profile.id,
        template_id: testTemplate.id,
        title: `Test Generated Text ${new Date().toISOString()}`,
        content: 'This is test generated content created to verify Supabase connection.',
        prompt: 'Test prompt'
      });
      
      if (!testGeneratedText) {
        throw new Error('Failed to create test generated text');
      }
      
      // Refresh the data
      const updatedTemplates = await getUserTemplates(profile.id);
      setTemplates(updatedTemplates);
      
      const updatedGeneratedTexts = await getUserGeneratedTexts(profile.id);
      setGeneratedTexts(updatedGeneratedTexts);
      
      setTestSuccess(true);
      setTestMessage('Test completed successfully! Supabase connection is working correctly.');
    } catch (err) {
      console.error('Test failed:', err);
      setTestSuccess(false);
      setTestMessage(`Test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (!user) {
    return <div className="p-4">Please sign in to use this component</div>;
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Supabase Connection Test</h2>
        
        <div className="p-4 border rounded">
          <h3 className="font-semibold">User Profile</h3>
          {profile ? (
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-sm">
              {JSON.stringify(profile, null, 2)}
            </pre>
          ) : (
            <p>No profile found</p>
          )}
        </div>

        <div className="p-4 border rounded">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Templates ({templates.length})</h3>
          </div>
          {templates.length > 0 ? (
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-sm">
              {JSON.stringify(templates.slice(0, 3), null, 2)}
              {templates.length > 3 && <p>...and {templates.length - 3} more</p>}
            </pre>
          ) : (
            <p>No templates found</p>
          )}
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold">Generated Texts ({generatedTexts.length})</h3>
          {generatedTexts.length > 0 ? (
            <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-sm">
              {JSON.stringify(generatedTexts.slice(0, 3), null, 2)}
              {generatedTexts.length > 3 && <p>...and {generatedTexts.length - 3} more</p>}
            </pre>
          ) : (
            <p>No generated texts found</p>
          )}
        </div>

        <div className="flex flex-col items-start space-y-4 mt-4">
          <button
            onClick={runTestOperations}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Run Test Operations
          </button>
          
          {testMessage && (
            <div className={`p-4 rounded ${testSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {testMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 