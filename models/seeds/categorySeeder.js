const Category = require('../category')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')

// category data
const SEED_CATEGORY = [
  {
    name: 'home',
    name_cn: '家居物業',
    name_icon: 'fas fa-house-user fa-3x'
  },
  {
    name: 'transportation',
    name_cn: '交通出行',
    name_icon: 'fas fa-shuttle-van fa-3x'
  },
  {
    name: 'entertainment',
    name_cn: '休閒娛樂',
    name_icon: 'fas fa-grin-beam fa-3x'
  },
  {
    name: 'food',
    name_cn: '餐飲食品',
    name_icon: 'fas fa-utensils fa-3x'
  },
  {
    name: 'else',
    name_cn: '其他',
    name_icon: 'fas fa-pen fa-3x'
  }
]

db.once('open', () => {
  Category.create(SEED_CATEGORY)
    .then(() => {
      console.log('Category Seed is done!')
      process.exit()
    })
    .catch(err => console.log(err))
})
