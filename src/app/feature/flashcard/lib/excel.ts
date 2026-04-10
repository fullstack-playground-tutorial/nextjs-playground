import * as XLSX from 'xlsx';

export interface Flashcard {
  front: string;
  back: string;
}

export function exportFlashcardsToExcel(flashcards: Flashcard[], fileName: string = 'flashcards.xlsx') {
  if (flashcards.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(flashcards);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Flashcards');

  // Set column widths
  const wscols = [
    { wch: 50 }, // Front
    { wch: 50 }, // Back
  ];
  worksheet['!cols'] = wscols;

  XLSX.writeFile(workbook, fileName);
}
