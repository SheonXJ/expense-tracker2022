const bcrypt = require('bcryptjs')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')

if (process.env.NODE_EVN !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

// record seed data
const SEED_RECORD = [
  { name: '午餐', date: '2019/04/23', count: 60, category_cn: '餐飲食品' },
  { name: '晚餐', date: '2019/04/23', count: 60, category_cn: '餐飲食品' },
  { name: '捷運', date: '2019/04/23', count: 120, category_cn: '交通出行' },
  { name: '電影：驚奇隊長', date: '2019/04/23', count: 220, category_cn: '休閒娛樂' },
  { name: '租金', date: '2015/04/01', count: 25000, category_cn: '家居物業' }
]

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

db.once('open', () => {
  Promise.all(SEED_USER.map(seedUser => {
    // 整理SEED_USER資料並建立user
    return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(seedUser.password, salt))
      .then(hash => User.create({
        name: seedUser.name,
        email: seedUser.email,
        password: hash
      }))
      .then(user => {
        // 整理SEED_RECORD資料並建立record
        return Promise.all(SEED_RECORD.map(record => {
          return Category.findOne({ name_cn: record.category_cn })
            .then(category => {
              record.userId = user._id
              record.categoryId = category._id
            })
            .then(() => Record.create(record))
        }))
      })
  }))
    .then(() => {
      console.log('SEED_USER & SEED_RECORD done!')
      process.exit()
    })
    .then(err => console.log(err))
})
