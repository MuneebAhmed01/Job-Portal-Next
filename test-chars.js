// Test specific character ranges
console.log('Character 0-31 (0x00-0x1F):');
for (let i = 0; i <= 31; i++) {
  console.log(`  ${i}: ${i.toString(16)} (${String.fromCharCode(i)})`);
}

console.log('\nCharacter 32-127 (0x20-0x7E):');
for (let i = 32; i <= 127; i++) {
  console.log(`  ${i}: ${i.toString(16)} (${String.fromCharCode(i)})`);
}

// Test if digits are in control range
console.log('\nDigits in control range:');
for (let i = 48; i <= 57; i++) {
  console.log(`  ${i}: ${i.toString(16)} (${String.fromCharCode(i)})`);
}
