import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Augmenter la limite pour les routes d'upload
  if (request.nextUrl.pathname.startsWith('/api/upload')) {
    const response = NextResponse.next();
    
    // Augmenter les limites
    response.headers.set('x-max-body-size', '104857600'); // 100MB
    
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};