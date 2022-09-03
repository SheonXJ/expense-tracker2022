const express = require('express')
const router = express.Router()
const dateformat = require('dateformat')
const Category = require('../../../models/category')
const Record = require('../../../models/record')
const { arrangeCategory } = require('../../../helpers/function-helper')

router.get('/', (req, res, next) => {
  const sort = req.query.sort || null
  if (!req.query.date) res.clearCookie('selected_day')
  const date = req.query.date || dateformat(Date.now(), 'yyyy-mm-dd')
  const dateStart = new Date(date).setHours(0, 0, 0, 0)
  const dateEnd = new Date(date).setHours(23, 59, 59, 999)
  Promise.all([
    Record.find({ userId: req.user._id, date: { $gte: dateStart, $lt: dateEnd } })
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
      // put category['else'] at the end of the array
      arrangeCategory(categories)
      // arrange records
      let totalCount = 0
      records.forEach(record => {
        record.date = dateformat(record.date, 'yyyy-mm-dd')
        record.icon = record.categoryId.name_icon
        totalCount += record.count
      })
      return res.render('index', { records, totalCount, categories, sort, date })
    })
    .catch(err => next(err))
})
router.get('/create', (req, res) => {
  const date = req.query.date || Date.now()
  const nowDate = dateformat(date, 'yyyy-mm-dd')
  Category.find()
    .lean()
    .then(categories => {
      arrangeCategory(categories)
      return res.render('create', { categories, nowDate })
    })
})
router.post('/create', (req, res, next) => {
  const { categoryId, name, count, date } = req.body
  // 將date加入現在時間
  const nowHours = new Date().toLocaleTimeString('en-GB')
  const fullDate = new Date(`${date}T${nowHours}`)
  if (!categoryId || !name || !count || !date) throw new Error('建立失敗，請確認資料！')
  Record.create({
    name,
    count,
    date: fullDate,
    categoryId,
    userId: req.user._id
  })
    .then(() => res.redirect('/records'))
    .catch(err => next(err))
})
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  Promise.all([
    Record.findById(id)
      .populate({
        path: 'categoryId',
        model: 'Category'
      })
      .lean(),
    Category.find()
      .lean()
  ])
    .then(([record, categories]) => {
      arrangeCategory(categories)
      record.date = dateformat(record.date, 'yyyy-mm-dd')
      return res.render('edit', { record, categories })
    })
})
router.put('/:id/edit', (req, res, next) => {
  const { name, date, count, categoryId } = req.body
  Record.findById(req.params.id)
    .then(record => {
      if (!record) throw new Error('變更失敗，此筆紀錄不存在！')
      record.name = name
      record.count = count
      record.date = date
      record.categoryId = categoryId
      return record.save()
    })
    .then(() => {
      req.flash('success_msg', '資料變更成功！')
      return res.redirect('/records')
    })
    .catch(err => next(err))
})
router.delete('/:id', (req, res) => {
  Record.findById(req.params.id)
    .then(record => record.delete())
    .then(() => res.redirect('/records'))
})

module.exports = router
