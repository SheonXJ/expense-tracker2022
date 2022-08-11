const express = require('express')
const router = express.Router()

const User = require('../../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  if (!name || !email || !password || !confirmPassword) {
    console.log('所有欄位都是必填。')
    res.redirect('back')
  }
  if (password !== confirmPassword) {
    console.log('密碼與確認密碼不相符！')
    res.redirect('back')
  }
  User.findOne({ email })
    .then(user => {
      if (user) {
        console.log('這個 Email 已經註冊過了。')
        return res.render('register', {
          name,
          email
        })
      }
      return User.create({
        name,
        email,
        password
      })
    })
    .then(() => {
      console.log('您已經成功註冊!')
      res.redirect('/users/login')
    })
    .catch(err => console.log(err))
})

module.exports = router
