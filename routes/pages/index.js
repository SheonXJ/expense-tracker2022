// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../../middleware/error-handler')
const { authenticator } = require('../../middleware/auth')

// 引入模組
const users = require('../pages/modules/users')
const auth = require('../pages/modules/auth')

// 將網址結構符合字串的 request 導向模組
router.use('/auth', auth)
router.use('/users', users)
router.use('/', generalErrorHandler, authenticator, (req, res) => {
  res.render('index')
})

// 匯出路由器
module.exports = router
