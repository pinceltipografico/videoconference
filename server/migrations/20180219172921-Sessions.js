/**
 *------------------------------------------------------------------------
 * MIGRATION TABLE FROM SESSIONS
 *------------------------------------------------------------------------
 */
module.exports = {
  /**
   * CREATE THE SCHEMA AND THE TABLE
   */
  up: (queryInterface, Sequelize) => {
    queryInterface.createSchema('sessions')
    return queryInterface.createTable(
      'session',
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

  /**
   * DROP THE TABLES AND SCHEMAS
   */
  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('session')
    return queryInterface.dropSchema('sessions')
  }
}
