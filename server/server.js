
const express = require("express") 
const app = express()
const port = 8000
const mongoose = require('mongoose')
const config = require('./config');
const uri = config.mongoURI;
app.use(express.json());
const cors = require('cors');
app.use(cors());

const dailyTaskEmail = require('./scripts/dailyTaskEmail');


const authRoute = require("./routes/auth")
app.use("/auth", authRoute)
const userRoute = require("./routes/user")
app.use("/user", userRoute)
const taskRoute = require("./routes/task")
app.use("/task", taskRoute)

const currentTime = new Date();
console.log(currentTime);
 

//Database
mongoose.connect(uri)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'DB error:'))
db.once('open', () => {
    console.log('DB successfully connected')
})

app.listen(port, () => {
   console.log(`Server running at http://localhost:${port}`)
}) 