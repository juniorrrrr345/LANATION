import { NextResponse } from 'next/server';
import { contentCache } from '@/lib/contentCache';

export async function POST() {
  try {
    console.log('🔄 Invalidation du cache demandée');
    
    // Invalider le cache côté client
    contentCache.invalidate();
    
    // Forcer un refresh complet
    await contentCache.refreshAll();
    
    console.log('✅ Cache invalidé et données rechargées');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cache invalidé avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Erreur invalidation cache:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de l\'invalidation du cache' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Utilisez POST pour invalider le cache' 
  });
}