'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        sessionId: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        email: {
          allowNull: false,
          type: Sequelize.STRING
        },
        phone: {
          allowNull: true,
          type: Sequelize.STRING
        },
        profileType: {
          allowNull: true,
          type: Sequelize.STRING
        },
        photo: {
          allowNull: true,
          type: Sequelize.TEXT
        },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE
        }
      },
      {
        schema: 'sessions'
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropSchema('users')
  }
}
