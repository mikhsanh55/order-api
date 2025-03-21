import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import bcrypt from 'bcryptjs';

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    password: string;
    resetToken?: string | null;
    resetTokenExpires?: Date | null;
}

// optional interface for create action
interface UserCreateAttributes extends Optional<UserAttributes, "id"> {}

class User extends Model<UserAttributes, UserCreateAttributes> implements UserAttributes
{
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public resetToken?: string | null;
    public resetTokenExpires?: Date | null;
}

// define table structure
User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetTokenExpires: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        sequelize,
        tableName: "users",
        hooks: {
            beforeCreate: async (user) => {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
);

export default User;