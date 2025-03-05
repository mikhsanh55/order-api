import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Untuk type safety
interface OrderAttributes {
    id: number;
    customerName: string;
    totalAmount: number;
    status: string;
    note?: string | null;
    items?: object | null;
}

// make id prop optional when there's create operation
interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
    public id!: number;
    public customerName!: string;
    public totalAmount!: number;
    public status!: string;
    public note?: string | null;
    public items?: object | null;
}

// define table structure
Order.init(
    {
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
    },
    {
        sequelize, // Koneksi database
        tableName: "orders", // Nama tabel di database
    }
);

export default Order;

