module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Sessions', [{
      name: 'Session Teste',
      sessionId: '2_MX40NjA0MDE2Mn5-MTUyMDYyODk4Mjg5OX5TTHpyRmJ2YmZiZm9melRIRW92QUp2K29-QX4'
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Sessions', null, {});
  }
};
