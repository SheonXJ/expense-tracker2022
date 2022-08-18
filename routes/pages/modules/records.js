const dateformat = require('dateformat')
const express = require('express')
const router = express.Router()

const Category = require('../../../models/category')
const Record = require('../../../models/record')

router.get('/', (req, res, next) => {
  const sort = req.query.sort || null
  Promise.all([
    Record.find({ userId: req.user._id })
      .populate({
        path: 'categoryId',
        model: 'Category'
      })
      .sort({ date: -1 })
      .lean(),
    Category.find()
      .lean()
  ])
    .then(([records, categories]) => {
      // if sort exist -> sort records
      if (sort) records = records.filter(record => record.categoryId.name === sort)
      // arrange records
      let totalCount = 0
      records.forEach(record => {
        record.date = dateformat(record.date, 'yyyy-mm-dd')
        record.icon = record.categoryId.name_icon
        totalCount += record.count
      })
      res.render('index', { records, totalCount, categories, sort })
    })
    .catch(err => next(err))
})
router.get('/create', (req, res) => {
  const nowDate = dateformat(Date.now(), 'yyyy-mm-dd')
  Category.find()
    .lean()
    .then(categories => res.render('create', { categories, nowDate }))
})
router.post('/create', (req, res, next) => {
  const { categoryId, name, count, date } = req.body
  if (!categoryId || !name || !count || !date) throw new Error('建立失敗，請確認資料！')
  Record.create({
    name,
    count,
    date,
    categoryId,
    userId: req.user._id
  })
    .then(() => res.redirect('/'))
    .catch(err => next(err))
})

module.exports = router
