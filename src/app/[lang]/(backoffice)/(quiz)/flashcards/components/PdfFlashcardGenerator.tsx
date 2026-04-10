'use client';

import React, { useState, useRef, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { PdfPage } from './PdfPage';
import { generateFlashcards } from '@/app/feature/flashcard/lib/gemini';
import { exportFlashcardsToExcel } from '@/app/feature/flashcard/lib/excel';
import { exportFlashcardsToCSV, exportFlashcardsToAnki } from '@/app/feature/flashcard/lib/export';
import { Flashcard as DomainFlashcard } from '@/app/feature/flashcard';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  existingCards?: DomainFlashcard[];
  onAddCards: (cards: DomainFlashcard[]) => void;
  onClose: () => void;
  localize: (key: string, ...args: any[]) => string;
}

export default function PdfFlashcardGenerator({ existingCards = [], onAddCards, onClose, localize }: Props) {
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentText, setCurrentText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedCards, setGeneratedCards] = useState<DomainFlashcard[]>([]);
  const [isScrollFrozen, setIsScrollFrozen] = useState(false);
  const [generatedJson, setGeneratedJson] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setNumPages(pdf.numPages);
      setError(null);
    }
  };

  const handlePageVisible = useCallback((pageNumber: number, text: string) => {
    if (isScrollFrozen) return;
    setCurrentPage(pageNumber);
    setCurrentText(text);
  }, [isScrollFrozen]);

  const handleGenerate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter Gemini API Key.');
      return;
    }
    if (!currentText.trim()) {
      setError('Page content is empty. Please scroll to a page with text or ensure the PDF is recognized.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const cards = await generateFlashcards(currentText, apiKey);
      const formattedCards = cards.map((c: any) => ({
        front: c.front,
        back: c.back,
        status: 'draft',
        example: ''
      }));
      setGeneratedCards(prev => [...formattedCards, ...prev]);
      setGeneratedJson(JSON.stringify(formattedCards, null, 2));
    } catch (err: any) {
      if (err.message?.includes('429')) {
        setError('Rate limit exceeded: You have sent too many requests. Please wait a moment and try again.');
      } else {
        setError(err.message || 'Generation failed. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToSet = () => {
    onAddCards(generatedCards);
    onClose();
  };

  const handleExportExcel = () => {
    if (generatedCards.length === 0) return;
    exportFlashcardsToExcel(generatedCards.map(c => ({ front: c.front, back: c.back })), 'generated_flashcards.xlsx');
  };

  const handleExportCSV = () => {
    if (generatedCards.length === 0) return;
    exportFlashcardsToCSV(generatedCards.map(c => ({ front: c.front, back: c.back })), 'flashcards.csv');
  };

  const handleExportAnki = () => {
    if (generatedCards.length === 0) return;
    exportFlashcardsToAnki(generatedCards.map(c => ({ front: c.front, back: c.back })), 'anki_flashcards.txt');
  };

  const handleCreateSingleCard = (idx: number) => {
    const card = generatedCards[idx];
    onAddCards([card]);
    setGeneratedCards(prev => prev.filter((_, i) => i !== idx));
  };


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-white/10 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">

        {/* PDF Area */}
        <div className={`flex-1 bg-slate-950 p-6 scrollbar-thin scrollbar-thumb-slate-800 ${isScrollFrozen ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{localize("flashcard_ai_modal_title")}</h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/20 active:translate-y-px"
            >
              {localize("flashcard_ai_upload_btn")}
            </button>
            <input type="file" ref={fileInputRef} hidden accept=".pdf" onChange={handleFileChange} />
          </div>

          {pdfDoc ? (
            Array.from({ length: numPages }, (_, i) => (
              <PdfPage
                key={i + 1}
                pageNumber={i + 1}
                pdfDocument={pdfDoc}
                onVisible={handlePageVisible}
                highlightWords={generatedCards.map(c => c.front)}
              />
            ))
          ) : (
            <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-xl">
              <svg className="w-12 h-12 mb-4 opacity-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <p className="font-medium opacity-50">Please upload a PDF source to begin</p>
            </div>
          )}
        </div>

        {/* AI Control Area */}
        <div className="w-full md:w-[350px] border-l border-white/10 p-6 flex flex-col bg-slate-900/50 backdrop-blur-3xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-indigo-400">GenAI Engine</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gemini 2.5 Flash</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2 tracking-widest">{localize("flashcard_ai_gemini_key")}</label>
            <input
              type="password"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your key here..."
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span className="w-full text-wrap" title={error}>{error}</span>
            </div>
          )}

          {pdfDoc && (
            <div className="flex-1 flex flex-col min-h-0 border-t border-white/5 pt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                  {localize("flashcard_ai_page_content", currentPage)}
                </label>
                <button
                  type="button"
                  onClick={() => setIsScrollFrozen(!isScrollFrozen)}
                  className={`text-[10px] px-2 py-1 rounded-md font-bold transition-all ${isScrollFrozen ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}
                >
                  {isScrollFrozen ? 'Unfreeze PDF' : 'Recognize Text / Freeze'}
                </button>
              </div>
              <p className="text-[10px] text-amber-500 mb-2 font-medium opacity-80 flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Note: Please generate cards for one page at a time.
              </p>
              <textarea
                className="flex-1 w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all min-h-[100px]"
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="mt-4 w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-600/20 active:translate-y-px active:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="animate-pulse">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.2 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.2L12 21l1.9-5.8a2 2 0 0 1 1.2-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.2L12 3z"></path></svg>
                    <span>Generate Cards</span>
                  </>
                )}
              </button>
            </div>
          )}

          {generatedJson && (
            <div className="mt-4 flex flex-col border-t border-white/5 pt-4">
              <label className="block text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">
                Generated JSON
              </label>
              <textarea
                className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-emerald-300/80 resize-none font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                value={generatedJson}
                onChange={(e) => setGeneratedJson(e.target.value)}
              />
            </div>
          )}

          {generatedCards.length > 0 && (
            <div className="mt-8 flex flex-col flex-1 min-h-0 border-t border-white/5 pt-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Queue ({generatedCards.length})</h4>
                <div className="flex gap-2">
                  <div className="flex bg-white/5 border border-white/10 rounded-md overflow-hidden">
                    <button type="button" onClick={handleExportAnki} title="Export Anki" className="text-[10px] px-2 py-1.5 text-slate-400 font-bold hover:bg-white/10 transition-all uppercase tracking-wide border-r border-white/10">Anki</button>
                    <button type="button" onClick={handleExportCSV} title="Export CSV" className="text-[10px] px-2 py-1.5 text-slate-400 font-bold hover:bg-white/10 transition-all uppercase tracking-wide border-r border-white/10">CSV</button>
                    <button type="button" onClick={handleExportExcel} title="Export Excel" className="text-[10px] px-2 py-1.5 text-slate-400 font-bold hover:bg-white/10 transition-all uppercase tracking-wide">Excel</button>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToSet}
                    className="text-[10px] px-3 py-1.5 bg-emerald-600/20 text-emerald-400 font-bold rounded-md border border-emerald-500/20 hover:bg-emerald-600/30 transition-all uppercase tracking-wide shrink-0"
                  >
                    {localize("flashcard_ai_apply_btn", generatedCards.length)}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                {generatedCards.map((card, idx) => (
                  <div key={idx} className="bg-white/[0.03] border border-white/5 p-4 rounded-xl text-[11px] hover:border-indigo-500/30 transition-colors flex flex-col">
                    <div className="flex justify-between items-start mb-1.5">
                      <div className="text-indigo-500 font-black uppercase tracking-widest text-[9px]">Front</div>
                      <button
                        type="button"
                        onClick={() => handleCreateSingleCard(idx)}
                        className="text-[9px] bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded hover:bg-indigo-500/20 uppercase tracking-wider font-bold shrink-0 transition-colors"
                      >
                        + Add Card
                      </button>
                    </div>
                    <div className="text-slate-100 font-medium mb-3 leading-relaxed">{card.front}</div>
                    <div className="text-indigo-500 font-black mb-1.5 uppercase tracking-widest text-[9px] pt-3 border-t border-white/5">Back</div>
                    <div className="text-slate-400 leading-relaxed italic">{card.back}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Existing Cards Area */}
        <div className="w-full md:w-[300px] border-l border-white/10 p-6 flex flex-col bg-slate-900/80 backdrop-blur-3xl overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 hidden md:flex">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-300">Existing Cards ({existingCards.length})</h3>
          </div>
          {existingCards.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-white/5 rounded-xl p-4 text-center h-[200px]">
              <p className="text-xs font-medium opacity-50">Set is empty.<br />Generated cards added here will be queued for creation.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto pr-2 space-y-3">
              {existingCards.map((card, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 p-3 rounded-lg text-[10px] hover:bg-white/10 transition-colors">
                  <div className="text-slate-400 font-bold mb-1 opacity-60">#{idx + 1}</div>
                  <div className="text-slate-200 font-medium mb-1 truncate">{card.front || "(Empty Front)"}</div>
                  <div className="text-slate-500 truncate">{card.back || "(Empty Back)"}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
