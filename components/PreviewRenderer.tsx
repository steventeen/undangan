'use client';

import React, { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';

interface PreviewRendererProps {
  html: string;
  cssCustom?: string;
}

export function PreviewRenderer({ html, cssCustom }: PreviewRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const document = iframeRef.current.contentDocument;
      if (document) {
        // Sanitize the HTML before injecting it
        const sanitizedHtml = DOMPurify.sanitize(html);

        document.open();
        document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <style>
                body { margin: 0; padding: 0; font-family: sans-serif; display: flex; justify-content: center; background-color: #f3f4f6; min-height: 100vh; }
                .invitation-wrapper { width: 100%; max-width: 480px; min-height: 100vh; background: white; position: relative; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
                /* Classic Wedding */
                .classic-wedding-container { padding: 40px 20px; text-align: center; background: #fffcfebf; border: 8px solid #fdf5f6; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;}
                .classic-wedding-container h1 { color: #b76e79; font-family: 'Georgia', serif; font-size: 2.5rem; margin-bottom: 10px; }
                .classic-wedding-container .details { margin: 30px 0; font-size: 1.1rem; color: #555; }
                .classic-wedding-container .btn { display: inline-block; padding: 10px 20px; margin: 10px; background: #b76e79; color: white; text-decoration: none; border-radius: 5px; }
                /* Modern Minimalist */
                .modern-minimalist-container { padding: 50px; background: #ffffff; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; }
                .modern-minimalist-container .names { font-size: 2rem; font-weight: 300; letter-spacing: 2px; text-align: center; color: #333; }
                .modern-minimalist-container .names span { font-style: italic; font-size: 1.5rem; color: #999; }
                .modern-minimalist-container .divider { border: 0; height: 1px; background: #eee; margin: 30px 0; }
                .modern-minimalist-container .event-info { text-align: center; color: #666; line-height: 1.8; }
                .modern-minimalist-container .maps-link { display: inline-block; margin-top: 20px; color: #000; text-transform: uppercase; font-size: 0.9rem; letter-spacing: 1px; text-decoration: none; border-bottom: 1px solid #000; }
                /* Rustic Garden */
                .rustic-garden-container { padding: 40px; background: #faf8f5; min-height: 100vh; text-align: center; border: 15px solid #dcd3cb; position: relative; display: flex; flex-direction: column; justify-content: center; }
                .rustic-garden-container h1 { color: #5a6b5d; font-family: 'Courier New', monospace; font-size: 2.2rem; margin: 20px 0;}
                .rustic-garden-container .subtitle { color: #8b7d6b; font-style: italic; margin-bottom: 30px; }
                .rustic-garden-container .btn-rustic { display: inline-block; padding: 12px 25px; margin-top: 20px; border: 2px solid #5a6b5d; color: #5a6b5d; text-decoration: none; text-transform: uppercase; letter-spacing: 1px; }
                /* Premium Gold */
                .premium-gold-container { padding: 20px; background: #111; min-height: 100vh; display: flex; flex-direction: column; }
                .premium-gold-container .gold-frame { flex: 1; border: 2px solid #d4af37; padding: 40px 20px; text-align: center; display: flex; flex-direction: column; justify-content: center; }
                .premium-gold-container h1 { color: #d4af37; font-family: 'Times New Roman', serif; font-size: 2.8rem; margin-bottom: 15px; }
                .premium-gold-container .invite-text { color: #aaa; margin-bottom: 30px; }
                .premium-gold-container .date-time { color: #fff; font-size: 1.2rem; margin-bottom: 20px; letter-spacing: 2px; }
                .premium-gold-container .venue { color: #ccc; margin-bottom: 40px; }
                .premium-gold-container .btn-gold { display: inline-block; padding: 15px 30px; background: linear-gradient(45deg, #bf953f, #fcf6ba, #b38728, #fbf5b7); color: #000; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
                
                /* Custom CSS injected from DB */
                ${cssCustom || ''}
              </style>
            </head>
            <body>
              <div class="invitation-wrapper">
                ${sanitizedHtml}
              </div>
            </body>
          </html>
        `);
        document.close();
      }
    }
  }, [html, cssCustom]);

  return (
    <iframe
      ref={iframeRef}
      className="h-full w-full border-0 bg-transparent rounded-xl"
      title="Template Preview"
    />
  );
}
