const express = require('express')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const router = express.Router()

const User = require('../../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body
  if (!name || !email || !password || !confirmPassword) throw new Error('所有欄位都是必填。')
  if (password !== confirmPassword) throw new Error('密碼與確認密碼不相符！')
  User.findOne({ email })
    .then(user => {
      if (user) throw new Error('這個 Email 已經註冊過了。')
      return bcrypt.hash(password, bcrypt.genSaltSync(10))
    })
    .then(hash => {
      return User.create({
        name,
        email,
        password: hash
      })
    })
    .then(() => {
      req.flash('success_msg', '您已經成功註冊!')
      res.redirect('/users/login')
    })
    .catch(err => next(err))
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))
router.get('/logout', (req, res) => {
  req.flash('success_msg', '您已成功登出!')
  req.logout()
  res.redirect('/users/login')
})

module.exports = router
