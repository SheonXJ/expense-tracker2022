const dateformat = require('dateformat')
const express = require('express')
const router = express.Router()

const Category = require('../../../models/category')
const Record = require('../../../models/record')

router.get('/', (req, res, next) => {
  Record.find({ userId: req.user._id })
    .populate({
      path: 'categoryId',
      model: 'Category'
    })
    .sort({ date: -1 })
    .lean()
    .then(records => {
      console.log(records)
      let totalCount = 0
      records.forEach(record => {
        record.date = dateformat(record.date, 'yyyy-mm-dd')
        record.icon = record.categoryId.name_icon
        totalCount += record.count
      })
      res.render('index', { records, totalCount })
    })
    .catch(err => next(err))
})

module.exports = router
