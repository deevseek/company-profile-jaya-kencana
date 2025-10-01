const sequelize = require('../config/db');
const User = require('./User');
const CompanyProfile = require('./CompanyProfile');
const Product = require('./Product');
const Project = require('./Project');
const Gallery = require('./Gallery');
const Message = require('./Message');

module.exports = {
  sequelize,
  User,
  CompanyProfile,
  Product,
  Project,
  Gallery,
  Message
};
