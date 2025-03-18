import MainLayout from '@/layouts/MainLayout';
import { SignUpButton } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

// Reusable components
const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="card hover:shadow-lg transition-shadow duration-300">
    <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mb-4">
      <span className="text-xl text-blue-600 dark:text-blue-400">{icon}</span>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, role, company }: { quote: string, author: string, role: string, company: string }) => (
  <div className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-6 border border-gray-100 dark:border-gray-700">
    <div className="flex flex-col h-full">
      <div className="mb-4 text-yellow-500">
        ★★★★★
      </div>
      <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow italic">"{quote}"</p>
      <div className="flex items-center mt-auto">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-300 font-semibold">{author.charAt(0)}</span>
        </div>
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{role}, {company}</div>
        </div>
      </div>
    </div>
  </div>
);

const PricingTier = ({ 
  name, 
  price, 
  description, 
  features, 
  cta, 
  highlighted = false 
}: { 
  name: string, 
  price: string, 
  description: string, 
  features: string[], 
  cta: string,
  highlighted?: boolean
}) => (
  <div className={`card h-full flex flex-col ${highlighted ? 'border-blue-500 dark:border-blue-400 shadow-lg ring-1 ring-blue-500 dark:ring-blue-400' : ''}`}>
    <div className="mb-6">
      <h3 className={`text-xl font-bold ${highlighted ? 'text-blue-600 dark:text-blue-400' : ''}`}>{name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-gray-500 dark:text-gray-400">/month</span>}
      </div>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    <ul className="space-y-3 flex-grow mb-6">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start">
          <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    <div className="mt-auto">
      <div className={`w-full ${highlighted ? 'btn btn-primary' : 'btn btn-outline'} py-2 px-3 rounded-md text-center`}>
        {cta}
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent"></div>
        </div>
        
        <div className="relative mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32" style={{ maxWidth: '80rem' }}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Transform Your Text with TextCraft
              </h1>
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 max-w-xl">
                Unlock the power of AI to create, edit, and enhance your content. Perfect for writers, marketers, and content creators.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <div className="btn btn-primary px-6 py-3 rounded-md text-lg">
                  <SignUpButton>Get started free</SignUpButton>
                </div>
                <Link href="/templates" className="btn btn-outline px-6 py-3 rounded-md text-lg no-underline">
                  Explore Templates
                </Link>
              </div>
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  <div className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-400 dark:bg-gray-600"></div>
                  <div className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-500 dark:bg-gray-500"></div>
                  <div className="inline-block h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-600 dark:bg-gray-400"></div>
                </div>
                <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                  Join <span className="font-semibold">1,000+</span> content creators
                </span>
              </div>
            </div>
            <div className="relative h-72 md:h-auto">
              <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Blog Intro Generator</h3>
                  <div className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                    Popular
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                    <input 
                      type="text" 
                      id="topic"
                      className="input" 
                      placeholder="Sustainable fashion trends" 
                      aria-describedby="topic-description"
                    />
                    <div id="topic-description" className="sr-only">Enter the main topic for your blog post</div>
                  </div>
                  <div>
                    <label htmlFor="tone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tone</label>
                    <select 
                      id="tone"
                      className="input"
                      aria-describedby="tone-description"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="enthusiastic">Enthusiastic</option>
                    </select>
                    <div id="tone-description" className="sr-only">Select the tone for your generated content</div>
                  </div>
                  <button 
                    className="btn btn-primary w-full"
                    aria-label="Generate blog intro"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Powerful Features at Your Fingertips</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Craft perfect content effortlessly with our advanced AI-powered tools
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon="📝" 
              title="Smart Templates" 
              description="Choose from dozens of proven templates to jumpstart your content creation process."
            />
            <FeatureCard 
              icon="✨" 
              title="AI Enhancement" 
              description="Polish your writing with AI suggestions for clarity, engagement, and style."
            />
            <FeatureCard 
              icon="🔄" 
              title="Content Repurposing" 
              description="Transform your content for different platforms and audiences with one click."
            />
            <FeatureCard 
              icon="🎯" 
              title="SEO Optimization" 
              description="Ensure your content ranks well with built-in SEO recommendations and analysis."
            />
            <FeatureCard 
              icon="⚡" 
              title="Quick Generation" 
              description="Generate high-quality content in seconds, not hours. Save time and focus on what matters."
            />
            <FeatureCard 
              icon="📊" 
              title="Performance Analytics" 
              description="Track content performance and get insights to improve engagement and conversion."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Join thousands of satisfied users who've transformed their content creation process
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard 
              quote="TextCraft has cut my content creation time in half. The templates are fantastic and the AI suggestions are spot-on."
              author="Sarah Johnson"
              role="Marketing Director"
              company="GrowthLabs"
            />
            <TestimonialCard 
              quote="As a freelance writer, TextCraft has become my secret weapon. I can take on more clients and deliver better work."
              author="Michael Chen"
              role="Freelance Writer"
              company="Self-employed"
            />
            <TestimonialCard 
              quote="The SEO optimization feature alone is worth the subscription. My blog posts are ranking higher than ever before."
              author="Emma Rodriguez"
              role="Content Strategist"
              company="TechVision"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that's right for you and start creating better content today
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <PricingTier 
              name="Free"
              price="Free"
              description="Perfect for trying out TextCraft"
              features={[
                "5 AI generations per month",
                "Access to basic templates",
                "Standard export options",
                "Community support"
              ]}
              cta="Get Started"
            />
            <PricingTier 
              name="Pro"
              price="$29"
              description="Great for individuals and small teams"
              features={[
                "100 AI generations per month",
                "Access to all templates",
                "Advanced customization",
                "Priority support",
                "Content analytics",
                "SEO optimization tools"
              ]}
              cta="Start 7-day Free Trial"
              highlighted={true}
            />
            <PricingTier 
              name="Enterprise"
              price="$99"
              description="For teams and businesses with advanced needs"
              features={[
                "Unlimited AI generations",
                "Custom templates",
                "Team collaboration features",
                "Dedicated account manager",
                "Advanced analytics",
                "API access",
                "Training and onboarding"
              ]}
              cta="Contact Sales"
            />
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Need a custom plan? <Link href="/contact">Contact us</Link> for enterprise pricing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ maxWidth: '80rem' }}>
          <h2 className="text-3xl sm:text-4xl font-bold">Ready to Transform Your Content?</h2>
          <p className="mt-4 text-blue-100 max-w-2xl mx-auto">
            Join thousands of content creators using TextCraft to create better content faster.
          </p>
          <div className="mt-8">
            <div className="inline-block btn bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md text-lg font-medium">
              <SignUpButton>Start for Free</SignUpButton>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
