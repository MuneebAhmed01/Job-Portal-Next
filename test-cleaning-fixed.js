// Test the corrected cleaning
const text = "+92 332 4440269";
const cleanedText = text.replace(/[\x00-\x1F]/g, '');

console.log('Original text:', text);
console.log('Cleaned text:', cleanedText);
console.log('Length after cleaning:', cleanedText.length);

// Test if the phone pattern works now
const phonePattern = /\+90\s*\d{1,4}\s*\d{1,6}/;
console.log('Phone pattern test:', phonePattern.test(cleanedText));
