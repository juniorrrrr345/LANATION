import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb-fixed';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: 'Connexion MongoDB Atlas réussie ✅',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    return NextResponse.json({ 
      error: 'Erreur de connexion MongoDB Atlas ❌',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}