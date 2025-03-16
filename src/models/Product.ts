import {DataTypes, Model, Optional} from 'sequelize';
import db from '../config/database';

// create interface for datatype model
interface ProductAttributes {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string | null;
}

// define interface that make id optional
interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public image?: string | null;
}

// define table structure
Product.init({
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
}, {
    sequelize: db,
    tableName: "products"
});

export default Product;