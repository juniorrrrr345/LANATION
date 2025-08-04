import { NextResponse } from 'next/server';

export async function GET() {
  // NE PAS UTILISER EN PRODUCTION - Uniquement pour debug
  const envCheck = {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: !!process.env.VERCEL,
    MONGODB_URI: process.env.MONGODB_URI ? 'Configuré ✅' : 'Manquant ❌',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Configuré ✅' : 'Manquant ❌',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Configuré ✅' : 'Manquant ❌',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Configuré ✅' : 'Manquant ❌',
    ADMIN_USERNAME: process.env.ADMIN_USERNAME ? 'Configuré ✅' : 'Manquant ❌',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'Configuré ✅' : 'Manquant ❌',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Configuré ✅' : 'Manquant ❌',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Non défini',
  };

  return NextResponse.json({
    message: '⚠️ ENDPOINT DE DEBUG - À SUPPRIMER EN PRODUCTION',
    timestamp: new Date().toISOString(),
    environment: envCheck,
    region: process.env.VERCEL_REGION || 'Non défini',
    url: process.env.VERCEL_URL || 'Non défini'
  });
}