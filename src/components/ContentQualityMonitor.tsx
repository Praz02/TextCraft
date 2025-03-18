import { useState, useEffect } from 'react';

interface ContentQualityMonitorProps {
  generatedText: string;
  contentType: string;
}

export default function ContentQualityMonitor({ generatedText, contentType }: ContentQualityMonitorProps) {
  const [quality, setQuality] = useState<{
    score: number;
    feedback: string[];
    strengths: string[];
  }>({ score: 0, feedback: [], strengths: [] });
  
  useEffect(() => {
    if (!generatedText || generatedText.length < 50) return;
    
    // Simple quality analysis based on content characteristics
    analyzeContent(generatedText, contentType);
  }, [generatedText, contentType]);
  
  // Analyze content for quality markers
  const analyzeContent = (text: string, type: string) => {
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+\s/).length;
    const paragraphCount = text.split(/\n\s*\n/).length;
    const avgSentenceLength = wordCount / (sentenceCount || 1);
    
    const feedback: string[] = [];
    const strengths: string[] = [];
    let score = 70; // Start with a baseline score
    
    // Check paragraph structure
    if (paragraphCount < 3 && wordCount > 200) {
      feedback.push("Consider breaking content into more paragraphs for better readability.");
      score -= 5;
    } else if (paragraphCount >= 3) {
      strengths.push("Good paragraph structure for easy reading.");
      score += 5;
    }
    
    // Check sentence length
    if (avgSentenceLength > 25) {
      feedback.push("Sentences are a bit long. Consider shortening some for better readability.");
      score -= 5;
    } else if (avgSentenceLength > 10 && avgSentenceLength <= 20) {
      strengths.push("Nice sentence length variety for good rhythm.");
      score += 5;
    }
    
    // Check word count based on content type
    if (type === 'blog-post' && wordCount < 300) {
      feedback.push("This blog post is relatively short. Consider adding more depth for better value.");
      score -= 5;
    } else if (type === 'blog-post' && wordCount > 500) {
      strengths.push("Good length for a comprehensive blog post.");
      score += 5;
    }
    
    if (type === 'social-media' && wordCount > 150) {
      feedback.push("Social media content is typically more concise. Consider shortening.");
      score -= 5;
    } else if (type === 'social-media' && wordCount < 100) {
      strengths.push("Appropriate length for social media content.");
      score += 5;
    }
    
    // Check for headings in blog posts
    if (type === 'blog-post') {
      const headingMatches = text.match(/#{1,3} .+|[A-Z][^.!?]+:/g);
      if (!headingMatches || headingMatches.length < 2) {
        feedback.push("Consider adding subheadings to structure your content better.");
        score -= 5;
      } else {
        strengths.push("Good use of headings to organize content.");
        score += 5;
      }
    }
    
    // Check for call-to-action
    if ((type === 'social-media' || type === 'ad-copy' || type === 'email') &&
        !text.match(/click|subscribe|follow|sign up|learn more|contact|call|buy|get|discover|try|start/i)) {
      feedback.push("Consider adding a clear call-to-action.");
      score -= 5;
    } else if (text.match(/click|subscribe|follow|sign up|learn more|contact|call|buy|get|discover|try|start/i)) {
      strengths.push("Includes a call-to-action to drive engagement.");
      score += 5;
    }
    
    // Cap score between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    setQuality({
      score,
      feedback: feedback.length ? feedback : ["No specific suggestions. The content looks good!"],
      strengths: strengths.length ? strengths : ["Content appears to be well-structured."]
    });
  };
  
  if (!generatedText || generatedText.length < 50) {
    return null;
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };
  
  return (
    <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
      <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        Content Quality Analysis
      </h3>
      
      <div className="flex items-center mt-2 mb-4">
        <div className="font-bold text-2xl mr-2 dark:text-gray-200">Score: </div>
        <div className={`font-bold text-2xl ${getScoreColor(quality.score)}`}>{quality.score}</div>
      </div>
      
      <div className="mt-3">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">Strengths:</h4>
        <ul className="list-disc pl-5 mt-1 text-sm text-gray-600 dark:text-gray-400">
          {quality.strengths.map((strength, i) => (
            <li key={`strength-${i}`}>{strength}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-3">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">Suggestions for improvement:</h4>
        <ul className="list-disc pl-5 mt-1 text-sm text-gray-600 dark:text-gray-400">
          {quality.feedback.map((feedback, i) => (
            <li key={`feedback-${i}`}>{feedback}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>This analysis is automated and may not capture all nuances of quality content.</p>
      </div>
    </div>
  );
} 