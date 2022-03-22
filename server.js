require('dotenv').config();
const dns = require('dns')
const mongoose = require('mongoose')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/shorturl/:shorturl', (req, res) => {
  console.log("in get " + req.params.shorturl)
});

app.use((req, res, next) => {
  const options = {
    family: 6,
    hints: dns.ADDRCONFIG | dns.V4MAPPED,
  };
  console.log(req.body.url)
  const hostname = (req.body.url) ? req.body.url.replace(/^https?:\/\//, '') : 'invalid'
  dns.lookup(hostname, options, (err, address, family) => {
    console.log("in dnsLookup " + hostname)
    if (err) return res.json({ error: "invalid url"})
    else next()
    // next()

  });
}).post('/api/shorturl', (req, res) => {
  console.log("in post " + req.body.url)
  res.json({
    original_url: req.body.url,
    short_url: "hi"
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
