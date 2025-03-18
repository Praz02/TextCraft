import MainLayout from '@/layouts/MainLayout';
import { SignUpButton } from '@clerk/nextjs';

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
  cta: React.ReactNode,
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
      <div className={`w-full ${highlighted ? 'btn btn-primary' : 'btn btn-outline'} py-2 px-3 rounded-md text-center cursor-pointer`}>
        {cta}
      </div>
    </div>
  </div>
);

export default function PricingPage() {
  return (
    <MainLayout>
      <div className="py-16 mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem' }}>
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that works best for you and your team
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
            cta={<SignUpButton>Get Started</SignUpButton>}
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
            cta={<SignUpButton>Start 7-day Free Trial</SignUpButton>}
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
        
        <div className="mt-16 text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-4">Need a custom plan?</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Our enterprise plans are tailored to your specific needs. Let's discuss how we can help your organization.
          </p>
          <a href="mailto:sales@textcraft.example.com" className="btn btn-primary inline-block px-6 py-3">
            Contact Our Sales Team
          </a>
        </div>
      </div>
    </MainLayout>
  );
} 