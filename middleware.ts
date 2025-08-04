import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Augmenter les limites pour les routes API spécifiques
  if (request.nextUrl.pathname.startsWith('/api/products') || 
      request.nextUrl.pathname.startsWith('/api/upload')) {
    
    // Ajouter des headers pour augmenter les limites
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/products/:path*',
    '/api/upload/:path*'
  ]
};