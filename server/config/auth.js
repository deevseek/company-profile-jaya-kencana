const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'supersecretkey',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d'
};
