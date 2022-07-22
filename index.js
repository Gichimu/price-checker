const express = require('express');

const route = require('./scraper')

const app = express()

// add route middleware
app.use('/api', route);

app.listen(3000, () => { console.log("Server running on port 3000")})