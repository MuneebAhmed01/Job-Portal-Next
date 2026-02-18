// Test the text cleaning regex
const text = "+92 332 4440269";
const regex1 = /[^\x20-\x7F]/g;
const regex2 = /[^\x00-\x7F]/g;

console.log('Original text:', text);
console.log('Regex1 [^\\x20-\\x7F]:', text.replace(regex1, ''));
console.log('Regex2 [^\\x00-\\x7F]:', text.replace(regex2, ''));
console.log('Length after regex1:', text.replace(regex1, '').length);
console.log('Length after regex2:', text.replace(regex2, '').length);

// Test specific characters
console.log('Plus sign char code:', '+'.charCodeAt(0));
console.log('9 char code:', '9'.charCodeAt(0));
console.log('Space char code:', ' '.charCodeAt(0));
console.log('3 char code:', '3'.charCodeAt(0));
console.log('2 char code:', '2'.charCodeAt(0));
