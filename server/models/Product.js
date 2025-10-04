const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Product = sequelize.define('Product', {
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
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactNumber: {
    type: DataTypes.STRING(32),
    allowNull: true,
    field: 'price',
    get() {
      const rawValue = this.getDataValue('contactNumber');
      return rawValue == null ? null : String(rawValue);
    },
    set(value) {
      if (value == null) {
        this.setDataValue('contactNumber', null);
        return;
      }

      const digits = String(value).replace(/\D/g, '');
      this.setDataValue('contactNumber', digits || null);
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = Product;
