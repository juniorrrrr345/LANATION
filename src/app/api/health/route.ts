import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    console.log('🔍 Health check - Test de déploiement Vercel');
    console.log('🌍 Environment:', process.env.NODE_ENV);
    console.log('🚀 Vercel env:', process.env.VERCEL);
    
    // Test de connexion MongoDB
    await connectDB();
    console.log('✅ MongoDB: Connexion réussie');
    
    return NextResponse.json({ 
      status: 'OK',
      message: 'Déploiement Vercel réussi ✅',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      vercel: !!process.env.VERCEL,
      mongodb: 'Connecté'
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return NextResponse.json({ 
      status: 'ERROR',
      message: 'Erreur de déploiement ❌',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}