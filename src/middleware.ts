import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define which routes should be public (no auth required)
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhooks(.*)', // Allow webhook endpoints without auth
  '/pricing',
  '/features',
  '/about',
  '/blog',
  '/contact',
  '/terms',
  '/privacy',
]);

// Use clerkMiddleware and protect non-public routes
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
