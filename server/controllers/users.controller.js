const fs = require('fs')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)

const upsert = (model, values, condition) => {
  return model.findOne({where: condition})
    .then(obj => {
      if (obj) {
        return obj.update(values)
      }
      return model.create(values)
    })
}

/**
 * SALVA O AVATAR
 * @param {String} base64
 * @param {UserObject} userObject
 */
async function saveAvatar (base64, userObject) {
  let photo = base64.replace(/^data:image\/png;base64,/, '')
  let name = `/${userObject.name.replace(' ', '')}-avatar.png`
  await writeFileAsync(`static${name}`, photo, 'base64')
  return name
}

/**
 * CREATE A USER
 * @param {Request} req
 * @param {Response} res
 */
const createUser = async (req, res) => {
  let { Users } = req.$models
  try {
    // SAVE THE AVATAR PICTURE
    if (req.body.photo) {
      req.body.photo = await saveAvatar(req.body.photo, req.body)
    }
    let user = await upsert(Users, req.body, {
      name: req.body.name,
      sessionId: req.body.sessionId
    })
    return res.jsonp(user)
  } catch (err) {
    if (err.errors) {
      return res.jsonp(err.errors)
    }
    return res.jsonp(err.message)
  }
}

/**
 * RETURN ALL USERS
 */
const getUsers = async (req, res) => {
  let { Users } = req.$models
  let {sessionId} = req.query
  let condition = sessionId ? {sessionId: sessionId} : {}
  try {
    let users = await Users.findAll({
      where: condition
    })
    return res.jsonp(users)
  } catch (err) {
    return res.jsonp(err.message)
  }
}

/**
 * FIND A USER
 * @param {Request} req
 * @param {Response} res
 */
const findOne = (req, res) => {
  return res.jsonp(req.user)
}

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
const updateUser = async (req, res) => {
  let { user } = req
  if (!user) {
    return res.status(404).send({message: 'Usuário não existe'})
  }
  try {
    if (req.body.photo) {
      req.body.photo = await saveAvatar(req.body.photo, user)
    }
    let savedUser = await user.update(req.body)
    return res.jsonp(savedUser)
  } catch (err) {
    console.log(err)
    return res.jsonp(err)
  }
}

/**
 * GET A UNIQUE USER
*/
const getUserById = async (req, res, next, id) => {
  let { Users } = req.$models
  try {
    let user = await Users.findById(id)
    req.user = user
    return next()
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  createUser,
  getUsers,
  findOne,
  getUserById,
  updateUser
}
