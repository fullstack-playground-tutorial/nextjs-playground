export interface Flashcard {
  front: string;
  back: string;
  [key: string]: any;
}

export function exportFlashcardsToCSV(flashcards: Flashcard[], fileName: string = 'flashcards.csv') {
  if (flashcards.length === 0) return;
  
  const csvContent = "Front,Back\n" + flashcards.map(e => `"${e.front.replace(/"/g, '""')}","${e.back.replace(/"/g, '""')}"`).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportFlashcardsToAnki(flashcards: Flashcard[], fileName: string = 'arki_flashcards.txt') {
  if (flashcards.length === 0) return;
  
  // Anki simple text format: front \t back
  const textContent = flashcards.map(e => `${e.front.replace(/\t/g, ' ')}\t${e.back.replace(/\t/g, ' ')}`).join("\n");
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
