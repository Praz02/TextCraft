import MainLayout from '@/layouts/MainLayout';

export default function TemplatesPage() {
  return (
    <MainLayout>
      <div className="py-16 mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '80rem' }}>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold">Templates</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from our collection of professionally crafted templates to get started with your content creation.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Template cards will be displayed here */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-t-lg mb-4 flex items-center justify-center">
                <span className="text-3xl text-gray-400 dark:text-gray-600">📄</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Template {i + 1}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Coming soon...</p>
              <button className="btn btn-primary w-full">Use Template</button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
} 