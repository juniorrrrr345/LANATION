import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GlobalBackgroundProvider from '@/components/GlobalBackgroundProvider'
import CachePreloader from '@/components/CachePreloader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LANATIONDULAIT - Boutique',
  description: 'Découvrez notre sélection de produits',
  keywords: 'boutique, produits, shopping',
  openGraph: {
    title: 'LANATIONDULAIT - Boutique',
    description: 'Découvrez notre sélection de produits',
    type: 'website',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Fond noir immédiat
              document.documentElement.style.backgroundColor = 'black';
              document.body.style.backgroundColor = 'black';
            `
          }}
        />
        <style>
          {`
            html, body {
              background-color: black !important;
              min-height: 100vh;
              min-height: -webkit-fill-available;
              overscroll-behavior: none;
              -webkit-overflow-scrolling: touch;
            }
            
            /* Empêcher le bounce effect sur iOS */
            body {
              position: fixed;
              width: 100%;
              height: 100%;
              overflow: hidden;
            }
            
            /* Container principal scrollable */
            .main-container {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
              background-color: black;
            }
          `}
        </style>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const settings = localStorage.getItem('adminSettings');
                  if (settings) {
                    const parsed = JSON.parse(settings);
                    if (parsed.backgroundImage) {
                      const style = document.createElement('style');
                      style.innerHTML = \`
                        html, body, .main-container {
                          background-image: url(\${parsed.backgroundImage}) !important;
                          background-size: cover !important;
                          background-position: center !important;
                          background-repeat: no-repeat !important;
                          background-attachment: fixed !important;
                          background-color: black !important;
                        }
                        .global-overlay {
                          background-color: rgba(0, 0, 0, \${(parsed.backgroundOpacity || 20) / 100}) !important;
                          backdrop-filter: blur(\${parsed.backgroundBlur || 5}px) !important;
                        }
                      \`;
                      document.head.appendChild(style);
                    }
                  }
                  // Fond noir par défaut
                  document.documentElement.style.backgroundColor = 'black';
                  document.body.style.backgroundColor = 'black';
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning style={{ backgroundColor: 'black' }}>
        <GlobalBackgroundProvider />
        <CachePreloader />
        {children}
      </body>
    </html>
  )
}