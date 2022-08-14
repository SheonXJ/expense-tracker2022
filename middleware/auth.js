const { isAuthenticated } = require('../helpers/auth-helper')

const authenticator = (req, res, next) => {
  if (isAuthenticated(req)) {
    return next()
  }
  req.flash('warning_msg', '請先登入才能使用!')
  res.redirect('/users/login')
}

module.exports = {
  authenticator
}
