'use client';

import { useState, useEffect } from 'react';
import { useUserData } from '@/hooks/useUserData';

export default function SettingsForm() {
  const { preferences, loading, error, updatePreferences } = useUserData();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Set form values from preferences when loaded
  useEffect(() => {
    if (preferences) {
      setTheme(preferences.theme || 'system');
      setNotificationsEnabled(preferences.notifications_enabled || true);
    }
  }, [preferences]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await updatePreferences({
        theme,
        notifications_enabled: notificationsEnabled
      });

      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully!'
      });
    } catch (err) {
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings. Please try again.'
      });
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading your preferences...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Preferences</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="theme">
            Theme
          </label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System (Follow device settings)</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="mr-2"
            />
            <span className="text-gray-700 text-sm font-bold">Enable notifications</span>
          </label>
        </div>
        
        {saveMessage && (
          <div 
            className={`mb-4 p-3 rounded ${
              saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {saveMessage.text}
          </div>
        )}
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 