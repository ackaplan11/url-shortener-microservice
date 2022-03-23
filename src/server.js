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

//create models
const schema = require('./schema.js')
const URL = mongoose.model('URL', schema.urlSchema)

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//URL Shortener
app.get('/api/shorturl/:shorturl', (req, res) => {
  const short_url = req.params.shorturl
  URL.findOne({short_url: short_url})
    .then((url) => {
      console.log(url.original_url)
      return res.status(301).redirect(url.original_url)
    })
    .catch((err) => {
      console.log(err)
      return res.status(400).send('Bad Request') 
    })    
})

app.post('/api/shorturl', validateURL, (req, res) => {
    console.log("in post " + req.body.url)
    URL.countDocuments({}, (err, count) => {
    const url = new URL({ 
      original_url: req.body.url,
      short_url: parseInt(count + 1)
    });
    url.save()
      .then((url) => {
        return res.json(url)
      })
      .catch((err) => {
        console.log(err)
        return res.status(400).send('Bad Request')
      })
  })
})

function validateURL(req, res, next) {
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
  })
}

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
