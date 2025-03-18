import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { getUserProfileByClerkId } from '@/utils/db';
import { createGeneratedText } from '@/utils/generated-texts';
import { supabaseAdmin } from '@/lib/supabase-server';
import deepseekConfig from '@/lib/deepseek';
import { getSystemPrompt } from '@/lib/prompt-templates';

// Mock AI response for development (will be replaced with actual API call)
const mockAIGenerate = async (prompt: string, template: string, options: any) => {
  // This is a placeholder for the actual AI API call
  console.log('Generating text with prompt:', prompt);
  console.log('Using template:', template);
  console.log('With options:', options);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return mock response
  return {
    generatedText: `This is a sample generated text based on your prompt: "${prompt}". 
      You selected the "${template}" template with the following options: 
      ${JSON.stringify(options, null, 2)}. 
      
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, 
      nisl eget aliquam ultricies, nunc nisl aliquet nunc, vitae aliquam nisl 
      nunc vitae nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl 
      aliquet nunc, vitae aliquam nisl nunc vitae nisl.`,
    metadata: {
      promptTokens: 20,
      completionTokens: 150,
      totalTokens: 170,
      model: 'gpt-3.5-turbo',
    }
  };
};

// Real OpenAI implementation
async function generateWithOpenAI(prompt: string, options: any) {
  console.log('Attempting to generate text with OpenAI API');
  console.log('Using model:', options.model || 'gpt-3.5-turbo');
  
  // Check if API key is available
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not defined in environment variables');
    throw new Error('OpenAI API key is not configured');
  }
  
  // Get the API key and ensure it's properly formatted
  const apiKey = process.env.OPENAI_API_KEY.trim();
  console.log('API key starts with:', apiKey.substring(0, 10) + '...');
  console.log('API key length:', apiKey.length);
  
  // Prepare request body with proper parameters
  const requestBody = {
    model: options.model || 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: options.systemPrompt || 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ],
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 500,
  };
  
  console.log('Sending request to OpenAI with body structure (not full content):', 
    JSON.stringify({
      model: requestBody.model,
      messages: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' }
      ],
      temperature: requestBody.temperature,
      max_tokens: requestBody.max_tokens
    }));
  
  try {
    console.log('Making fetch request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
        // Removed potentially problematic headers
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Received response with status:', response.status);
    const responseText = await response.text(); // Get the raw response text first
    console.log('Response text length:', responseText.length);
    console.log('Response text preview:', responseText.substring(0, 100) + '...');
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error('OpenAI API error response:', errorData);
        throw new Error(errorData.error?.message || `OpenAI request failed with status ${response.status}`);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        throw new Error(`OpenAI request failed with status ${response.status}: ${responseText.substring(0, 100)}`);
      }
    }

    // Parse the response text as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse successful response:', parseError);
      throw new Error('Failed to parse OpenAI response');
    }
    
    console.log('Successfully parsed response from OpenAI. Response structure:', 
      JSON.stringify({
        id: data.id,
        object: data.object,
        model: data.model,
        usage: data.usage,
        choices_length: data.choices?.length
      }));
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Unexpected response structure from OpenAI:', data);
      throw new Error('Unexpected response structure from OpenAI');
    }
    
    return {
      generatedText: data.choices[0].message.content,
      metadata: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
        model: data.model || options.model || 'gpt-3.5-turbo',
      }
    };
  } catch (error) {
    console.error('Detailed OpenAI error:', error);
    throw error; // Re-throw to be caught by the main try/catch
  }
}

// DeepSeek implementation
async function generateWithDeepSeek(prompt: string, options: any) {
  console.log('Attempting to generate text with DeepSeek API');
  console.log('Using model:', options.model || deepseekConfig.model);
  
  // Check if API key is available
  if (!deepseekConfig.apiKey) {
    console.error('DeepSeek API key is not defined in environment variables');
    throw new Error('DeepSeek API key is not configured');
  }
  
  // Get the API key and ensure it's properly formatted
  const apiKey = deepseekConfig.apiKey.trim();
  
  // Create a more intelligent system prompt based on content type, tone, and length
  let enhancedSystemPrompt = options.systemPrompt;
  if (options.contentType && options.tone && options.length) {
    enhancedSystemPrompt = getSystemPrompt(
      options.contentType,
      options.tone,
      options.length
    );
    console.log('Using enhanced system prompt based on content preferences');
  }
  
  // Optimize temperature based on content type for best results
  let optimizedTemperature = options.temperature !== undefined 
    ? options.temperature 
    : deepseekConfig.temperature;
  
  // For creative content like ad copy, slightly higher temperature works better
  if (options.contentType === 'ad-copy' || options.contentType === 'social-media') {
    optimizedTemperature = Math.min(Math.max(optimizedTemperature, 0.4), 0.8);
    console.log('Optimized temperature for creative content:', optimizedTemperature);
  }
  
  // For factual content like product descriptions, lower temperature works better
  if (options.contentType === 'product-description') {
    optimizedTemperature = Math.min(optimizedTemperature, 0.5);
    console.log('Optimized temperature for factual content:', optimizedTemperature);
  }
  
  // Prepare request body with proper parameters
  const requestBody = {
    model: options.model || deepseekConfig.model,
    messages: [
      { role: 'system', content: enhancedSystemPrompt || 'You are a helpful assistant.' },
      { role: 'user', content: prompt }
    ],
    temperature: optimizedTemperature,
    max_tokens: options.maxTokens !== undefined ? options.maxTokens : deepseekConfig.maxTokens,
    top_p: options.topP !== undefined ? options.topP : deepseekConfig.topP,
    frequency_penalty: options.frequencyPenalty !== undefined ? options.frequencyPenalty : deepseekConfig.frequencyPenalty,
    presence_penalty: options.presencePenalty !== undefined ? options.presencePenalty : deepseekConfig.presencePenalty,
  };
  
  console.log('Sending request to DeepSeek with body structure (not full content):', 
    JSON.stringify({
      model: requestBody.model,
      messages: [
        { role: 'system', content: '...' },
        { role: 'user', content: '...' }
      ],
      temperature: requestBody.temperature,
      max_tokens: requestBody.max_tokens
    }));
  
  try {
    console.log('Making fetch request to DeepSeek API...');
    const response = await fetch(`${deepseekConfig.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Received response with status:', response.status);
    const responseText = await response.text(); // Get the raw response text first
    console.log('Response text length:', responseText.length);
    console.log('Response text preview:', responseText.substring(0, 100) + '...');
    
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error('DeepSeek API error response:', errorData);
        throw new Error(errorData.error?.message || `DeepSeek request failed with status ${response.status}`);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        throw new Error(`DeepSeek request failed with status ${response.status}: ${responseText.substring(0, 100)}`);
      }
    }

    // Parse the response text as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse successful response:', parseError);
      throw new Error('Failed to parse DeepSeek response');
    }
    
    console.log('Successfully parsed response from DeepSeek. Response structure:', 
      JSON.stringify({
        id: data.id,
        object: data.object,
        model: data.model,
        usage: data.usage,
        choices_length: data.choices?.length
      }));
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error('Unexpected response structure from DeepSeek:', data);
      throw new Error('Unexpected response structure from DeepSeek');
    }
    
    return {
      generatedText: data.choices[0].message.content,
      metadata: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
        model: data.model || options.model || deepseekConfig.model,
      }
    };
  } catch (error) {
    console.error('Detailed DeepSeek error:', error);
    throw error; // Re-throw to be caught by the main try/catch
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { prompt, template, options = {} } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get user profile from Supabase
    let userProfile = await getUserProfileByClerkId(user.id);
    
    // If user profile doesn't exist, create one
    if (!userProfile) {
      console.log('User profile not found, creating new profile for', user.id);
      try {
        // Get the primary email address if available
        const primaryEmail = user.emailAddresses && user.emailAddresses.length > 0 
          ? user.emailAddresses[0].emailAddress 
          : '';
          
        // Create a new user profile in Supabase
        const { data, error } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            clerk_id: user.id,
            email: primaryEmail,
            first_name: user.firstName || null,
            last_name: user.lastName || null,
            subscription_status: 'free',
            subscription_tier: 'free'
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating user profile:', error);
          
          // If the error is a duplicate key error, it means the profile exists but couldn't be fetched
          // Let's try to fetch it again
          if (error.code === '23505') { // Duplicate key violation
            console.log('Profile already exists, trying to fetch again...');
            const { data: existingProfile, error: fetchError } = await supabaseAdmin
              .from('user_profiles')
              .select('*')
              .eq('clerk_id', user.id)
              .single();
              
            if (fetchError) {
              console.error('Error fetching existing profile:', fetchError);
              return NextResponse.json({ error: 'Failed to retrieve user profile' }, { status: 500 });
            }
            
            userProfile = existingProfile;
          } else {
            return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
          }
        } else {
          userProfile = data;
          
          // Create default user preferences
          await supabaseAdmin
            .from('user_preferences')
            .insert({
              user_id: data.id,
              theme: 'system',
              notifications_enabled: true
            });
        }
      } catch (error) {
        console.error('Error in profile creation/fetching:', error);
        return NextResponse.json({ error: 'Failed to process user profile' }, { status: 500 });
      }
    }

    // At this point, ensure we have a user profile
    if (!userProfile) {
      return NextResponse.json({ error: 'Could not establish user profile' }, { status: 500 });
    }

    // Determine if user has appropriate access for AI generation
    // ... existing access code ...

    // Generate text using selected AI provider
    let result;
    try {
      if (options.provider === 'openai') {
        // For OpenAI provider, pass additional parameters from form
        const openaiOptions = {
          ...options,
          contentType: body.contentType || 'blog-post',
          tone: body.tone || 'professional',
          length: body.length || 'medium',
        };
        result = await generateWithOpenAI(prompt, openaiOptions);
        console.log('Successfully generated text with OpenAI');
      } else {
        // Default to DeepSeek with enhanced options
        const deepseekOptions = {
          ...options,
          contentType: body.contentType || 'blog-post',
          tone: body.tone || 'professional',
          length: body.length || 'medium',
        };
        result = await generateWithDeepSeek(prompt, deepseekOptions);
        console.log('Successfully generated text with DeepSeek');
      }
    } catch (error: any) {
      console.error('AI generation error:', error.message);
      
      // Try the other provider if one fails
      if (options.provider === 'openai') {
        console.log('OpenAI failed, trying DeepSeek...');
        try {
          result = await generateWithDeepSeek(prompt, options);
          console.log('Successfully generated text with DeepSeek (fallback)');
        } catch (deepseekError: any) {
          console.error('DeepSeek fallback error:', deepseekError.message);
          
          // Return specific errors to the client if they're related to configuration
          if (deepseekError.message && deepseekError.message.includes('API key')) {
            console.error('API key issue detected. Please check your API key configuration.');
            return NextResponse.json({ 
              error: 'API configuration error: ' + deepseekError.message
            }, { status: 500 });
          }
          
          // Fall back to mock generation if both APIs fail
          console.log('All AI providers failed, falling back to mock generation...');
          result = await mockAIGenerate(prompt, template, options);
          console.log('Mock generation completed');
        }
      } else {
        console.log('DeepSeek failed, trying OpenAI...');
        try {
          // When falling back to OpenAI, use a valid OpenAI model instead of the DeepSeek model
          const openaiOptions = {
            ...options,
            model: 'gpt-3.5-turbo' // Use a valid OpenAI model when falling back
          };
          result = await generateWithOpenAI(prompt, openaiOptions);
          console.log('Successfully generated text with OpenAI (fallback)');
        } catch (openaiError: any) {
          console.error('OpenAI fallback error:', openaiError.message);
          
          // Return specific errors to the client if they're related to configuration
          if (openaiError.message && openaiError.message.includes('API key')) {
            console.error('API key issue detected. Please check your API key configuration.');
            return NextResponse.json({ 
              error: 'API configuration error: ' + openaiError.message
            }, { status: 500 });
          }
          
          // Fall back to mock generation if both APIs fail
          console.log('All AI providers failed, falling back to mock generation...');
          result = await mockAIGenerate(prompt, template, options);
          console.log('Mock generation completed');
        }
      }
    }

    // Save the generated text to the database
    let savedText = null;
    try {
      savedText = await createGeneratedText({
        user_id: userProfile.id,
        template_id: template || null,
        title: options.title || 'Generated Text',
        content: result.generatedText,
        prompt: prompt,
        generation_settings: {
          ...options,
          metadata: result.metadata
        }
      });
    } catch (dbError) {
      console.error('Error saving generated text to database:', dbError);
      // Continue execution even if database save fails
    }

    // Return the generated text
    return NextResponse.json({
      generatedText: result.generatedText,
      metadata: result.metadata,
      savedTextId: savedText?.id
    });
  } catch (error: any) {
    console.error('Error in generateText route:', error);
    return NextResponse.json({ error: error.message || 'An unknown error occurred' }, { status: 500 });
  }
} 