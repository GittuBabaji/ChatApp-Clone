
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/uploadthing(.*)', 
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth();
  }
});

export const config = {
  matcher: [
    
    '/((?!_next|.*\\..*).*)', 
    '/(api|trpc)(.*)',        
  ],
};
