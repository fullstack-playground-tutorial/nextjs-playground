'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '@/app/feature/flashcard/hooks/useIntersectionObserver';

interface PdfPageProps {
  pageNumber: number;
  pdfDocument: any;
  onVisible: (pageNumber: number, text: string) => void;
  scale?: number;
  highlightWords?: string[];
}

export const PdfPage: React.FC<PdfPageProps> = ({ 
  pageNumber, 
  pdfDocument, 
  onVisible,
  scale = 1.5,
  highlightWords = []
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerTargetRef = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  
  // Triggers the text extraction when page is mostly directly visible
  const visibilityEntry = useIntersectionObserver(observerTargetRef, {
    threshold: 0.6,
  });

  // Triggers the heavy PDF rendering BEFORE it even scrolls into view. 
  // Freezes to True once rendered so we don't dispose pages unless destroyed.
  const renderTriggerEntry = useIntersectionObserver(observerTargetRef, {
    threshold: 0,
    rootMargin: '100% 0px', 
    freezeOnceVisible: true,
  });

  const shouldRender = !!renderTriggerEntry?.isIntersecting;

  useEffect(() => {
    if (!shouldRender) return;

    let renderTask: any = null;
    let isCancelled = false;

    const renderPage = async () => {
      if (!pdfDocument || !containerRef.current) return;

      try {
        const page = await pdfDocument.getPage(pageNumber);
        
        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        
        // Dynamically create a new canvas for each render pass to completely 
        // bypass "Cannot use the same canvas" error caused by React StrictMode remounts.
        const canvas = document.createElement('canvas');
        canvas.className = "max-w-full h-auto shadow-sm";
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;

        if (isCancelled) return;

        // Replace loading state with the newly rendered canvas
        const container = containerRef.current;
        container.innerHTML = '';
        container.appendChild(canvas);

        // Extract text
        const textContent = await page.getTextContent();
        const extractedText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        // Highlight words
        if (highlightWords && highlightWords.length > 0) {
          context.fillStyle = 'rgba(255, 235, 59, 0.4)'; // Yellow highlight
          const lowerHighlight = highlightWords.map(w => w.toLowerCase());
          
          textContent.items.forEach((item: any) => {
            if (item.str && lowerHighlight.some((hw) => item.str.toLowerCase().includes(hw))) {
              const [x, y] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
              // In PDF standard, y represents the bottom of the text.
              // item.height gives the height in PDF points.
              const height = item.height * scale;
              const width = item.width * scale;
              context.fillRect(x, y - height, width, height + 4); 
            }
          });
        }

        
        setText(extractedText);
      } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
          console.error('PDF Render error:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdfDocument, pageNumber, scale, shouldRender, highlightWords.join(',')]);

  useEffect(() => {
    if (visibilityEntry?.isIntersecting && text) {
      onVisible(pageNumber, text);
    }
  }, [visibilityEntry?.isIntersecting, pageNumber, text, onVisible]);

  return (
    <div 
      ref={observerTargetRef} 
      className={`mb-8 flex justify-center transition-all duration-300 bg-white rounded-lg overflow-hidden shadow-xl min-h-[300px] ${
        visibilityEntry?.isIntersecting 
          ? 'scale-[1.02] ring-2 ring-indigo-500 shadow-indigo-500/40' 
          : 'scale-100 ring-0'
      }`}
    >
      <div ref={containerRef} className="w-full flex justify-center items-center">
         {/* Spinner shown until canvas is dynamically appended */}
         <div className="py-20 text-indigo-500 opacity-50 flex flex-col items-center gap-3">
             {shouldRender ? (
               <>
                 <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">Rendering {pageNumber}...</span>
               </>
             ) : (
                <span className="text-[10px] font-bold uppercase tracking-widest">Page {pageNumber} (Waiting to Load)</span>
             )}
         </div>
      </div>
    </div>
  );
};
