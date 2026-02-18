// Test the exact regex being used
const text = "+92 332 4440269";
const regex = /[\x00-\x1F]/g;

const matches = text.match(regex);
console.log('Matches found:', matches);
console.log('Text after regex:', text.replace(regex, ''));

// Test each character
for (let i = 0; i < text.length; i++) {
  const char = text[i];
  const isControlChar = char.charCodeAt(0) <= 31; // 0-31 are control chars
  console.log(`Char ${i}: "${char}" (${char.charCodeAt(0)}) - Control: ${isControlChar}`);
}
