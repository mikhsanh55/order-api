import { QueryInterface, DataTypes } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.addColumn('users', 'resetToken', {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'resetTokenExpires', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },
  async down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.removeColumn('users', 'resetToken');
    await queryInterface.removeColumn('users', 'resetTokenExpires');
  }
};