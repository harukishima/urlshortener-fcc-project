require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

const db = [];

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// POST endpoint that receives a URL and returns the shortened URL
app.post('/api/shorturl', async (req, res) => {
  var expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  var regex = new RegExp(expression);
  if (!req.body.url.match(regex)) {
    res.json({ error: 'invalid url' });
  } else {
    let response = db.find((item) => item.original_url === req.body.url);
    if (!response) {
      const url = req.body.url;
      const shortUrl = db.length + 1;
      response = {
        original_url: url,
        short_url: shortUrl,
      };
      db.push(response);
    }
    res.json(response);
  }
});

//redirect to original url
app.get('/api/shorturl/:shortUrl', async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const response = db.find((item) => item.short_url === Number(shortUrl));
  if (!response) {
    res.json({ error: 'invalid url' });
  } else {
    res.redirect(response.original_url);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
