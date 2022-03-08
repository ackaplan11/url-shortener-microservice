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
  console.log(req.body.url)
  const options = {
    family: 6,
    hints: dns.ADDRCONFIG | dns.V4MAPPED,
  };
  const hostname = req.body.url.replace(/^https?:\/\//, '')
  dns.lookup(hostname, options, (err, address, family) => {
    console.log('address: %j family: IPv%s', address, family)
    console.log(err)
    next()
  });
}).post('/api/shorturl', (req, res) => {
  res.json({
    original_url: req.body.url,
    short_url: "hi"
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
