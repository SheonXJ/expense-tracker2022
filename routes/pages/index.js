// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticator } = require('../../middleware/auth')

// 引入模組
const users = require('../pages/modules/users')
const auth = require('../pages/modules/auth')
const records = require('../pages/modules/records')
const analysis = require('../pages/modules/analysis')

// 將網址結構符合字串的 request 導向模組
router.use('/users', users)
router.use('/auth', auth)
router.use('/records', authenticator, records)
router.use('/analysis', authenticator, analysis)
router.get('/', (req, res) => {
  res.redirect('/records')
})
router.use('/', generalErrorHandler)

// 匯出路由器
module.exports = router
