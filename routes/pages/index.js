// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()

// 引入模組
const users = require('../pages/modules/users')

// 將網址結構符合字串的 request 導向模組
router.use('/users', users)

router.get('/', (req, res) => {
  res.send('index')
})

// 匯出路由器
module.exports = router
