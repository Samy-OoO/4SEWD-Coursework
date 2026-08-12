import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

// One row per quantity change on a product. Append-only - rows are never
// edited, so this doubles as an audit trail ("what happened to our stock
// and why") as well as the source data for the inventory trend chart.
const StockMovement = sequelize.define(
  'StockMovement',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Signed: positive = stock added, negative = stock removed.
    change: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // The product's quantity immediately after this change, so history
    // can be displayed without recomputing a running total every time.
    quantityAfter: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'stock_movements',
    updatedAt: false,
  },
);

export default StockMovement;
