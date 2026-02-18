// Test with hardcoded text in backend
fetch('http://localhost:3002/resume/parse-text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ 
    text: "+92 332 4440269"
  })
})
.then(response => response.json())
.then(data => {
  console.log('Hardcoded test result:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});
