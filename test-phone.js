// Test phone extraction specifically
const testPhone = "+92 332 4440269";

const phoneRegex1 = /\+90\s*\d{3}\s*\d{3}\s*\d{4}/;
const phoneRegex2 = /\+90\s*\d{10}/;
const phoneRegex3 = /\+90\d{10}/;

console.log('Testing phone:', testPhone);
console.log('Regex1 result:', testPhone.match(phoneRegex1));
console.log('Regex2 result:', testPhone.match(phoneRegex2));
console.log('Regex3 result:', testPhone.match(phoneRegex3));
