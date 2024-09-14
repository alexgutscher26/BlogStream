import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/posts(.*)', '/settings(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

// // /middleware.ts
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// // Create a route matcher to protect specific routes
// const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/posts(.*)', '/settings(.*)']);

// // Middleware to handle Clerk authentication
// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   const url = req.nextUrl.clone();
  
//   // If the route is protected, enforce authentication
//   if (isProtectedRoute(req)) {
//     const user = await auth();  // Authenticate using Clerk
//     if (!user) {
//       return NextResponse.redirect(new URL('/sign-in', req.url)); // Redirect to sign-in if not authenticated
//     }
//   }
  
//   return NextResponse.next(); // Proceed if authenticated or route is not protected
// });

// // Configuration to specify matcher patterns
// export const config = {
//   matcher: [
//     // Skip Next.js internals and static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// };

