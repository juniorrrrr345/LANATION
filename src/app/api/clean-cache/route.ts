import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Retourner un script qui nettoie le localStorage côté client
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            // Nettoyer tout le localStorage
            localStorage.clear();
            sessionStorage.clear();
            
            // Recharger la page
            window.location.href = '/';
          </script>
          <p>Nettoyage du cache en cours...</p>
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
    return NextResponse.json({ error: 'Erreur lors du nettoyage du cache' }, { status: 500 });
  }
}