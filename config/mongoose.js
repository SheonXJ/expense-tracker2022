// load package
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

// setting database
mongoose.connect(MONGODB_URI)
const db = mongoose.connection

db.on('error', () => {
  console.log('Mongodb error!')
})
db.once('open', () => {
  console.log('Mongodb is connected!')
})

module.exports = db
