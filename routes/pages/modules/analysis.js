const express = require('express')
const router = express.Router()
const dateformat = require('dateformat')

const Record = require('../../../models/record')

router.get('/overview', (req, res, next) => {
  const nowDate = new Date()
  const currentYear = nowDate.getFullYear()
  const currentMonthIndex = req.query.month ? Number(req.query.month) : nowDate.getMonth() // 月份index從0開始
  const currentDays = new Date(currentYear, (currentMonthIndex + 1), 0).getDate()
  const yearStart = new Date(`${currentYear}-01-01T00:00:00.000Z`) // 先加回UTC+8
  const yearEnd = new Date(`${currentYear}-12-31T23:59:59.999Z`) // 先加回UTC+8
  const monthStart = new Date(currentYear, currentMonthIndex, 1, 0, 0, 0, 0)
  const monthEnd = new Date(currentYear, currentMonthIndex, currentDays, 23, 59, 59, 999)
  Promise.all([
    // 查找每月份支出
    Record.aggregate([
      { $match: { userId: req.user._id, date: { $gte: yearStart, $lt: yearEnd } } },
      { $group: {
        _id: { $month: { $add: ['$date', 28800000] } }, // 因為UTC+8，將時間加8小時
        total: { $sum: '$count' }
      }}
    ]),
    // 查找本月份Top3支出
    Record.find({ userId: req.user._id, date: { $gte: monthStart, $lt: monthEnd } })
      .populate({
        path: 'categoryId',
        model: 'Category'
      })
      .sort({ count: -1 })
      .limit(3)
      .lean(),
    // 查找前三類別支出總額
    Record.aggregate([
      { $match: { userId: req.user._id, date: { $gte: monthStart, $lt: monthEnd } } },
      { $group: {
        _id: '$categoryId',
        count: { $sum: '$count' }
      }},
      { $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category_docs'
      }}
    ])
      .sort({ count: -1 })
      .limit(3)
  ])
    .then(([yearRecords, topRecords, categoryRecords]) => {
      // 建立12月份的空陣列，再將查詢到有資料的月份放入空陣列[for chart]
      const everyMonthCount = Array.from({ length: 12 }, () => 0)
      yearRecords.forEach(record => {
        everyMonthCount[record._id - 1] = record.total
      })
      // 整理category前三名資料[for chart]
      const currentMonthCount = everyMonthCount[currentMonthIndex]
      categoryRecords.forEach(record => {
        record.categoryName = record.category_docs[0].name_cn
        record.subCount = currentMonthCount - record.count
        record.percent = Math.floor(((record.count / currentMonthCount) * 100) + 0.5)
      })
      // 整理資料格式[for Top3 records]
      topRecords.forEach(record => {
        record.date = dateformat(record.date, 'yyyy-mm-dd')
        record.icon = record.categoryId.name_icon
      })
      res.render('analysis-overview', { currentMonthIndex, currentYear, status: 'overview', everyMonthCount, topRecords, categoryRecords, currentMonthCount })
    })
    .catch(err => next(err))
})
router.get('/detail', (req, res) => {
  const nowDate = new Date()
  const currentYear = nowDate.getFullYear()
  const currentMonth = nowDate.getMonth() + 1
  res.render('analysis-overview', { currentMonth, currentYear, status: 'detail' })
})
router.get('/category', (req, res) => {
  const nowDate = new Date()
  const currentYear = nowDate.getFullYear()
  const currentMonth = nowDate.getMonth() + 1
  res.render('analysis-overview', { currentMonth, currentYear, status: 'category' })
})
router.get('/ranking', (req, res) => {
  const nowDate = new Date()
  const currentYear = nowDate.getFullYear()
  const currentMonth = nowDate.getMonth() + 1
  res.render('analysis-overview', { currentMonth, currentYear, status: 'ranking' })
})

module.exports = router
