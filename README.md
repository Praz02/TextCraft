# TextCraft - Text Editing SaaS Platform

TextCraft is a modern SaaS platform for AI-powered text generation and editing. It provides a powerful solution for content creators, marketers, and writers to generate high-quality content quickly.

## 🎨 UI Features

- **Responsive Design**: Fully responsive UI that works on all device sizes
- **Dark Mode Support**: Seamless dark/light mode switching with system preference detection
- **Modern UI Components**: Clean, accessible component library built with Tailwind CSS
- **Consistent Design System**: Cohesive design language throughout the application

## 🚀 Core Features

- **Text Generation**: AI-powered content generation for various purposes
- **Templates**: Pre-built templates for different content types
- **Customization**: Advanced options to tailor generated content to your needs
- **User Profiles**: Personal workspace for saved content and preferences
- **Email Integration**: Send generated content directly via email

## 🛠️ Technology Stack

- **Next.js**: React framework for building the UI
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Clerk**: Authentication and user management
- **Supabase**: Database and backend functions
- **Next-themes**: Dark mode implementation
- **Resend**: Email delivery service

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/textcraft.git
   cd textcraft
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your credentials
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret key
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key
- `RESEND_API_KEY`: API key for Resend email service

### Setting up Resend

1. Sign up for a Resend account at [resend.com](https://resend.com)
2. Create an API key in the Resend dashboard
3. Add your API key to the `.env.local` file as `RESEND_API_KEY`
4. Verify your domain in Resend for better deliverability (optional but recommended)

## 📖 Documentation

For more detailed information about setting up Clerk and Supabase, see:
- [CLERK-SUPABASE-SETUP.md](./CLERK-SUPABASE-SETUP.md)
- [SUPABASE-SETUP-GUIDE.md](./SUPABASE-SETUP-GUIDE.md)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the MIT License.
