// Debug character encoding and pattern matching
const text = "+92 332 4440269";

console.log('=== CHARACTER DEBUGGING ===');
console.log('Text bytes:', Array.from(text).map(b => b.charCodeAt(0)));
console.log('Text length:', text.length);

// Test each character
for (let i = 0; i < text.length; i++) {
  const char = text[i];
  console.log(`Char ${i}: "${char}" (${char.charCodeAt(0)})`);
}

// Test the exact patterns step by step
const patterns = [
  /\+90\s*\d{3}\s*\d{3}\s*\d{6}/,  // Should match +92 332 4440269
  /\+90\s*\d{10}/,                    // Should match +90 3324440269  
  /\+90\d{10}/,                      // Should match +903324440269
];

console.log('\n=== PATTERN TESTING ===');
patterns.forEach((pattern, index) => {
  const match = text.match(pattern);
  console.log(`Pattern ${index + 1}: ${pattern}`);
  console.log(`Match result:`, match);
  if (match) {
    console.log(`Matched: "${match[0]}"`);
  }
});
