'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_name: {
        type: Sequelize.STRING
      },
      //Note: Kenapa ada kolom user_id di table item? Mestinya cukup di table orders saja
      user_id: {
        type: Sequelize.INTEGER
      },
      //Note: Penamaan kolom user_id pakai camel_case sedangkan createdAt pakai camelCase. Bisa dibuat konsisten pilih salah 1 aja
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('items');
  }
};