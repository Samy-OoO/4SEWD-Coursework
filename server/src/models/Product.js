import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Human-readable inventory identifier, e.g. "HD-001". Optional so
    // existing rows / API clients that don't send one still work.
    sku: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Freeform grouping label (e.g. "Electronics", "Sports"). Kept as a
    // plain optional string rather than a separate Category table/model,
    // to avoid adding backend surface the coursework didn't ask for.
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    // What this product sells for.
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    // What it cost to acquire/produce. Optional - purely informational.
    costPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Threshold used to flag a product as "low stock" on the dashboard
    // and product table, instead of a number hardcoded in the UI.
    minStock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    // Stored as a base64 data URL (or a /images/... path for seed data),
    // matching how the React form already reads uploaded files client-side.
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    alt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'products',
  },
);

export default Product;
