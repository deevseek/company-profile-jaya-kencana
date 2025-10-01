const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CompanyProfile = sequelize.define('CompanyProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  vision: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mission: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  yearFounded: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  certifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  heroImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  legalDocument: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('legalDocument');
      if (!rawValue) {
        return [];
      }

      if (Array.isArray(rawValue)) {
        return rawValue;
      }

      try {
        const parsed = JSON.parse(rawValue);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return parsed ? [parsed] : [];
      } catch (error) {
        return [rawValue];
      }
    },
    set(value) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        this.setDataValue('legalDocument', null);
        return;
      }

      if (Array.isArray(value)) {
        this.setDataValue('legalDocument', JSON.stringify(value));
        return;
      }

      this.setDataValue('legalDocument', JSON.stringify([value]));
    }
  }
});

module.exports = CompanyProfile;
