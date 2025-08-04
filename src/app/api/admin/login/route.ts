import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Vérifier le mot de passe (en production, utiliser un hash)
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
      return NextResponse.json({ success: true, message: 'Connexion réussie' });
    } else {
      return NextResponse.json({ success: false, message: 'Mot de passe incorrect' }, { status: 401 });
    }
  } catch (error) {
    console.error('Erreur de connexion admin:', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}