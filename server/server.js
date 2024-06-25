const express = require("express")
const app = express()
const port = 8000
const mongoose = require('mongoose')
const config = require('./config');
const uri = config.mongoURI;

mongoose.connect(uri);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'DB error:'))
db.once('open', () => {
    console.log('DB successfully connected')
})

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`)
}) 