const { Router } = require('express')
const passport = require('passport')

const router = Router()

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login?inv=1' }))

router.get('/logout', function (req, res) {
  delete req.session.authUser
  res.redirect('/login')
})

router.get('/user', function (req, res) {
  res.json({ usuario: req.session.authUser })
})

module.exports = router
