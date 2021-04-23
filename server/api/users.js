const { createUser, getUsers, getUserById, findOne, updateUser } = require('../controllers/users.controller')
module.exports = router => {
  router.post('/users', createUser)
  router.get('/users', getUsers)
  router.get('/users/:userId', findOne)
  router.put('/users/:userId', updateUser)

  // set userId param
  router.param('userId', getUserById)
}
