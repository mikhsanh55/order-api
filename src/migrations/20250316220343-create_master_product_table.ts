import {QueryInterface, DataTypes} from 'sequelize';

export default {
  async up(query: QueryInterface): Promise<void> {
    await query.createTable("products", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      image:  {
        type: DataTypes.STRING,
        allowNull: true
      }
    });
  },
  async down(query: QueryInterface): Promise<void> {
    await query.dropTable("products");
  }
}