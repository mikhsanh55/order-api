import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('orders', {
      id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
      },
      customerName: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      totalAmount: {
          type: DataTypes.FLOAT,
          allowNull: false,
      },
      status: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      note: {
          type: DataTypes.TEXT,  // ✅ Tipe TEXT
          allowNull: true,       // ✅ Bisa null
          defaultValue: null,    // ✅ Default null
      },
      items: {
          type: DataTypes.JSON,   // ✅ Tipe JSON
          allowNull: true,        // ✅ Bisa null
          defaultValue: null,     // ✅ Default null
      },
    });
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('orders');
  },
};