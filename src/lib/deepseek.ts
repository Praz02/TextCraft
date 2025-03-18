// Check for required environment variables
if (!process.env.DEEPSEEK_API_KEY) {
  console.error('DEEPSEEK_API_KEY is not defined in environment variables');
}

if (!process.env.DEEPSEEK_BASE_URL) {
  console.error('DEEPSEEK_BASE_URL is not defined in environment variables');
}

// DeepSeek configuration
const deepseekConfig = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseUrl: process.env.DEEPSEEK_BASE_URL,
  model: process.env.DEEPSEEK_MODEL || 'deepseek-r1',
  maxTokens: process.env.DEEPSEEK_MAX_TOKENS ? parseInt(process.env.DEEPSEEK_MAX_TOKENS) : 4096,
  // For reasoning tasks, we want lower temperature by default (more deterministic)
  temperature: process.env.DEEPSEEK_TEMPERATURE ? parseFloat(process.env.DEEPSEEK_TEMPERATURE) : 0.0,
  // Additional optimized parameters for reasoning
  topP: process.env.DEEPSEEK_TOP_P ? parseFloat(process.env.DEEPSEEK_TOP_P) : 0.8,
  frequencyPenalty: process.env.DEEPSEEK_FREQUENCY_PENALTY ? parseFloat(process.env.DEEPSEEK_FREQUENCY_PENALTY) : 0.2,
  presencePenalty: process.env.DEEPSEEK_PRESENCE_PENALTY ? parseFloat(process.env.DEEPSEEK_PRESENCE_PENALTY) : 0.1,
};

export default deepseekConfig; 