// Test the specific pattern
const text = "+92 332 4440269";
const pattern = /\+90\s*\d{3}\s*\d{3}\s*\d{6}/;

console.log('Text:', text);
console.log('Pattern:', pattern);
console.log('Match:', text.match(pattern));
