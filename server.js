require('dotenv').config();
const dns = require('dns')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use(async (req, res, next) => {
  dns.lookup(req.body.url, {family: 0}, (err, address, family) => {
    if (err) {
      console.error(err)
      next()
      return res.json({ error: 'invalid url' })
    } else {
      
    }
  })
}).post('/api/shorturl', (req, res) => {
  res.json({
    original_url: req.body.url,
    short_url: "hi"
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
