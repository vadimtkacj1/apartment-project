import { defineMessages } from '@/lib/adminI18n';

/**
 * Chrome of the customisable widget boards (/admin and /admin/analytics):
 * edit mode, drag & drop, block widths and the block picker. Block titles
 * themselves stay in each page's own namespace.
 */
export const boardMessages = defineMessages({
  he: {
    customize: 'התאמה אישית',
    doneEditing: 'סיום עריכה',
    addBlock: 'הוספת בלוק',
    resetLayout: 'איפוס פריסה',
    customizeHint: 'גררו בלוק (מכל מקום בו) כדי לשנות סדר, או הזיזו אותו בחיצים. אפשר גם לשנות רוחב ולהסתיר בלוקים. הפריסה נשמרת בדפדפן הזה.',
    moveEarlier: (name: string) => `הזזת "${name}" אחורה`,
    moveLater: (name: string) => `הזזת "${name}" קדימה`,
    searchBlocks: 'חיפוש בלוק…',
    noSearchResults: 'לא נמצאו בלוקים תואמים',
    blocksAvailable: (count: number) => `${count} בלוקים זמינים להוספה`,
    emptyBoard: 'כל הבלוקים מוסתרים. הוסיפו בלוק כדי להתחיל.',
    layoutReset: 'הפריסה אופסה',
    blockAdded: (name: string) => `הבלוק "${name}" נוסף`,
    blockHidden: (name: string) => `הבלוק "${name}" הוסתר`,
    hideBlock: (name: string) => `הסתרת הבלוק "${name}"`,
    dragBlock: (name: string) => `גרירה לשינוי מיקום: ${name}`,
    blockWidth: 'רוחב הבלוק',
    widthThird: 'שליש',
    widthHalf: 'חצי',
    widthTwoThirds: 'שני שליש',
    widthFull: 'רוחב מלא',
    addDialogTitle: 'הוספת בלוק',
    addDialogDescription: 'בחרו בלוק כדי להוסיף אותו לסוף הלוח. אפשר לגרור ולשנות את הרוחב שלו אחר כך.',
    noHiddenBlocks: 'כל הבלוקים כבר מוצגים',
    close: 'סגירה',

    // Screen-reader narration for keyboard drag & drop
    dndInstructions: 'הקישו רווח או Enter כדי להתחיל גרירה, מקשי חצים להזזה, רווח לשחרור ו-Esc לביטול.',
    dndPickedUp: (name: string, position: number, total: number) =>
      `הבלוק ${name} נאחז. מיקום ${position} מתוך ${total}.`,
    dndMoved: (name: string, position: number, total: number) =>
      `הבלוק ${name} הועבר למיקום ${position} מתוך ${total}.`,
    dndDropped: (name: string, position: number, total: number) =>
      `הבלוק ${name} שוחרר במיקום ${position} מתוך ${total}.`,
    dndCancelled: (name: string) => `הגרירה של הבלוק ${name} בוטלה.`,
  },
  en: {
    customize: 'Customize',
    doneEditing: 'Done',
    addBlock: 'Add block',
    resetLayout: 'Reset layout',
    customizeHint: 'Drag a block from anywhere on it to reorder, or nudge it with the arrows. You can also change its width or hide it. The layout is saved in this browser.',
    moveEarlier: (name: string) => `Move "${name}" earlier`,
    moveLater: (name: string) => `Move "${name}" later`,
    searchBlocks: 'Search blocks…',
    noSearchResults: 'No matching blocks',
    blocksAvailable: (count: number) => `${count} blocks available to add`,
    emptyBoard: 'Every block is hidden. Add one to get started.',
    layoutReset: 'Layout reset',
    blockAdded: (name: string) => `"${name}" added`,
    blockHidden: (name: string) => `"${name}" hidden`,
    hideBlock: (name: string) => `Hide "${name}"`,
    dragBlock: (name: string) => `Drag to reorder: ${name}`,
    blockWidth: 'Block width',
    widthThird: 'One third',
    widthHalf: 'Half',
    widthTwoThirds: 'Two thirds',
    widthFull: 'Full width',
    addDialogTitle: 'Add a block',
    addDialogDescription: 'Pick a block to append it to the board. You can drag it and change its width afterwards.',
    noHiddenBlocks: 'Every block is already on the board',
    close: 'Close',

    // Screen-reader narration for keyboard drag & drop
    dndInstructions: 'Press space or enter to start dragging, arrow keys to move, space to drop and escape to cancel.',
    dndPickedUp: (name: string, position: number, total: number) =>
      `Picked up block ${name}. Position ${position} of ${total}.`,
    dndMoved: (name: string, position: number, total: number) =>
      `Block ${name} moved to position ${position} of ${total}.`,
    dndDropped: (name: string, position: number, total: number) =>
      `Block ${name} dropped at position ${position} of ${total}.`,
    dndCancelled: (name: string) => `Dragging block ${name} was cancelled.`,
  },
});
