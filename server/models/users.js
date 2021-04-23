module.exports = (sequelize, DataTypes) => {
  let Users = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.UUID,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        field: 'name',
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        field: 'email',
        allowNull: false,
        type: DataTypes.STRING
      },
      phone: {
        field: 'phone',
        type: DataTypes.STRING(255)
      },
      profileType: {
        field: 'profileType',
        type: DataTypes.STRING(255)
      },
      photo: {
        field: 'photo',
        type: DataTypes.TEXT
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    },
    {
      schema: 'sessions',
      tableName: 'users',
      timestamps: true,
      underscored: true
    }
  )
  Users.associate = models => {
    Users.belongsTo(models.Sessions, {
      onDelete: 'CASCADE',
      foreignKey: 'sessionId'
    })
  }
  return Users
}
