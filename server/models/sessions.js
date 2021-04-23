module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Sessions',
    {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        field: 'name',
        type: DataTypes.STRING(255)
      },
      sessionId: {
        field: 'sessionId',
        type: DataTypes.TEXT
      },
      created_at: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false
      }
    },
    {
      schema: 'sessions',
      tableName: 'session',
      timestamps: true,
      underscored: true
    }
  )
}
