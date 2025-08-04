import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Retourner un script qui nettoie sessionStorage et recharge
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            // Nettoyer sessionStorage pour forcer le chargement
            sessionStorage.removeItem('hasVisited');
            
            // Recharger la page principale
            window.location.href = '/';
          </script>
          <p>Redirection en cours...</p>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Erreur' }, { status: 500 });
  }
}