const testData = {
  text: "Muneeb Ahmed +92 332 4440269 | imuneebahmed0@gmail.com | linkedin.com/in/muneeb-ahmed0 | github.com/MuneebAhmed01 Summary Motivated and detail-oriented Computer Science undergraduate with hands-on experience in full-stack development using the MERN stack. Strong foundation in web development principles, responsive UI design, and REST API integration. Passionate about building scalable and user-centric web applications. Currently pursuing a B.Sc. in Computer Science and seeking entry-level opport..."
};

fetch('http://localhost:3002/resume/parse-text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
.then(response => response.json())
.then(data => {
  console.log('Parse Result:', data);
})
.catch(error => {
  console.error('Error:', error);
});
