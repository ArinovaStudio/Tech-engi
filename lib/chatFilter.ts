const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// Links: explicit URLs, www., or a bare domain that ends in a real TLD. The old rule matched any
// "word.word" (so "Done.Thanks", "ok.sure" and "Node.js" were blocked as links).
const TLDS = "com|in|org|net|io|co|dev|app|me|ai|xyz|info|biz|us|uk|edu|gov|ly|gg|tv|to|site|online|tech|store|shop|cloud|link|page";
const urlRegex = new RegExp(
  `(https?:\\/\\/[^\\s]+)|(www\\.[^\\s]+)|(\\b[a-z0-9-]+(?:\\.[a-z0-9-]+)*\\.(?:${TLDS})\\b(?:\\/[^\\s]*)?)`,
  "i",
);
const phoneRegex = /(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\d{10}|\d{3}[\s-]\d{3}[\s-]\d{4}|\(\d{3}\)[\s-]?\d{3}[\s-]\d{4})/;

export function validateChatMessage(content: string): { isValid: boolean; reason?: string } {
  if (emailRegex.test(content)) {
    return { isValid: false, reason: "Sharing email addresses is strictly prohibited." };
  }
  
  if (phoneRegex.test(content)) {
    return { isValid: false, reason: "Sharing phone numbers is strictly prohibited." };
  }

  if (urlRegex.test(content)) {
    return { isValid: false, reason: "External links are not allowed in the chat. Please use the Resources tab." };
  }

  return { isValid: true };
}