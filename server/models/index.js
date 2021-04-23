const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('../config/config.json')[env]
const models = {}

config.operatorsAliases = Sequelize.Op

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable])
  : new Sequelize(config.database, config.username, config.password, config)

const files = fs
  .readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf('.') !== 0 && file !== 'index.js' && file.slice(-3) === '.js'
  )

files.forEach(file => {
  const model = sequelize.import(path.join(__dirname, file))
  models[model.name] = model
})

Object.keys(models).forEach(m => {
  if (models[m].associate) models[m].associate(models)
})

require('pg').types.setTypeParser(1114, s => new Date(s + '+0000'))

module.exports = { models, db: sequelize, sq: Sequelize }
