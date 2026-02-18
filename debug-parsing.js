// Debug the full parsing process
const fullText = "Muneeb Ahmed +92 332 4440269 | imuneebahmed0@gmail.com | linkedin.com/in/muneeb-ahmed0 | github.com/MuneebAhmed01 Summary Motivated and detail-oriented Computer Science undergraduate with hands-on experience in full-stack development using the MERN stack. Strong foundation in web development principles, responsive UI design, and REST API integration. Passionate about building scalable and user-centric web applications. Currently pursuing a B.Sc. in Computer Science and seeking entry-level opport...";

console.log('=== DEBUGGING PHONE EXTRACTION ===');
console.log('Full text:', fullText);
console.log('Looking for:', '+92 332 4440269');

// Test all our patterns
const patterns = [
  /\+90\d{10}/,
  /\+90\s*\d{3}\s*\d{3}\s*\d{4}/,
  /\+90\s*\d{10}/,
  /\+?\d{10,15}/
];

patterns.forEach((pattern, index) => {
  const match = fullText.match(pattern);
  console.log(`Pattern ${index + 1}:`, pattern);
  console.log(`Match:`, match);
});

fetch('http://localhost:3002/resume/parse-text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: fullText })
})
.then(response => response.json())
.then(data => {
  console.log('\n=== API RESULT ===');
  console.log(JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});
