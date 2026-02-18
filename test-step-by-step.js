// Test the failing pattern step by step
const text = "+92 332 4440269";
const pattern = /\+90\s*\d{3}\s*\d{3}\s*\d{6}/;

console.log('=== STEP BY STEP PATTERN TESTING ===');
console.log('Text:', text);
console.log('Pattern:', pattern);

// Test each part of the pattern
const test1 = /\+90/.test(text);
console.log('+90 matches:', test1);

const test2 = /\s*\d{3}/.test(text);
console.log('3 digits matches:', test2);

const test3 = /\s*\d{3}/.test(text.substring(3)); // After +90
console.log('3 digits after +90 matches:', test3);

const test4 = /\s*\d{3}/.test(text.substring(6)); // After first space
console.log('3 digits after space matches:', test4);

const test5 = /\s*\d{6}/.test(text.substring(9)); // After second space  
console.log('6 digits after second space matches:', test5);

const fullMatch = pattern.test(text);
console.log('Full pattern match:', fullMatch);
console.log('Expected groups:', fullMatch ? pattern.exec(text) : null);
