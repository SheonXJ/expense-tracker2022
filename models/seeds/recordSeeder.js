const bcrypt = require('bcryptjs')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')

if (process.env.NODE_EVN !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

// function
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

// record seed data
const SEED_DATA = {
  name: ['早餐', '午餐', '晚餐', '宵夜', '捷運', '電影', '租金', '電費', '寵物'],
  count: [99, 120, 250, 399, 545, 999, 1200, 3500, 2150, 736],
}
const SEED_USER = [
  {
    name: 'User1',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'User2',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', async () => {
  // find category data for Id
  const category = await Category.find().select(['_id'])
  const currentYear = new Date().getFullYear()
  // create User then create 12month Arr then create records Arr
  await Promise.all(SEED_USER.map(async (seed_user) => {
    // create User
    seed_user.password = bcrypt.hashSync(seed_user.password, bcrypt.genSaltSync(10), null)
    const user = await User.create(seed_user)
    // create 12 month Arr
    for (let i = 0; i < 12; i++) {
      // get how many days in month
      const nDays = new Date(currentYear, (i + 1), 0).getDate()
      // create records Arr
      const records = Array.from({ length: 30 }).map(() => {
        const name = SEED_DATA.name[getRandomInt(SEED_DATA.name.length)]
        const count = SEED_DATA.count[getRandomInt(SEED_DATA.count.length)]
        const date = new Date(currentYear, i, getRandomInt(nDays))
        const categoryId = category[getRandomInt(category.length)]._id
        const userId = user._id
        let record = {
          name,
          count,
          date,
          categoryId,
          userId
        }
        return record
      })
      await Record.create(records)
    }
  }))
  console.log('SEED_USER & SEED_RECORD done!')
  process.exit()
})
