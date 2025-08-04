import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CachePreloader from '@/components/CachePreloader'
import GlobalBackgroundProvider from '@/components/GlobalBackgroundProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'JBEL INDUSTRY - Boutique en ligne',
  description: 'JBEL INDUSTRY - Votre boutique en ligne. Produits de qualité et livraison rapide.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#000000',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JBEL INDUSTRY'
  },
  formatDetection: {
    telephone: false
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Background par défaut pour éviter l'écran noir */
              html, body {
                background-color: #1a1a1a !important;
                background-image: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
                min-height: 100vh;
              }
              .main-container {
                min-height: 100vh;
                background-color: transparent;
              }
              .global-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(5px);
                -webkit-backdrop-filter: blur(5px);
                z-index: 1;
              }
              .content-layer {
                position: relative;
                z-index: 2;
                min-height: 100vh;
              }
            `
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Appliquer le background immédiatement depuis localStorage
              (function() {
                try {
                  const settings = localStorage.getItem('shopSettings');
                  if (settings) {
                    const parsed = JSON.parse(settings);
                    if (parsed.backgroundImage) {
                      const style = document.createElement('style');
                      style.textContent = \`
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