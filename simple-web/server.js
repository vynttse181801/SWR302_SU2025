const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Simple CI/CD Test Page</title>
    </head>
    <body>
      <h1>Welcome to CI/CD Test Page</h1>
      <button id="hello-btn" onclick="alert('Hello!')">Say Hello</button>
      <form method="POST" action="/login">
        <input type="text" name="username" placeholder="Username" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      <div id="login-result">${req.query.msg || ''}</div>
    </body>
    </html>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123') {
    res.redirect('/?msg=Login+success!');
  } else {
    res.redirect('/?msg=Login+failed!');
  }
});

app.listen(port, () => {
  console.log(`Simple web server running at http://localhost:${port}`);
}); 