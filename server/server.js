const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { DataTypes } = require('sequelize');
require('dotenv').config();

const { sequelize, User, CompanyProfile } = require('./models');

const authRoutes = require('./routes/authRoutes');
const companyProfileRoutes = require('./routes/companyProfileRoutes');
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsPath = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

app.use('/api/auth', authRoutes);
app.use('/api/company-profiles', companyProfileRoutes);
app.use('/api/products', productRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'CV. Jaya Kencana API' });
});

const clientBuildPath = path.join(__dirname, '..', 'client', 'dist');

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }

    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'CV. Jaya Kencana API' });
  });
}

const ensureCompanyProfileSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const tableDescription = await queryInterface.describeTable('CompanyProfiles');

  if (!tableDescription.legalDocument) {
    await queryInterface.addColumn('CompanyProfiles', 'legalDocument', {
      type: DataTypes.STRING,
      allowNull: true
    });
    console.log('Added legalDocument column to CompanyProfiles table');
  }
};

const bootstrap = async () => {
  try {
    await sequelize.sync();
    await ensureCompanyProfileSchema();

    const adminExists = await User.findOne({ where: { email: 'admin@jayakencana.co.id' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
      await User.create({
        name: 'Administrator',
        email: 'admin@jayakencana.co.id',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin user created: admin@jayakencana.co.id / admin123');
    }

    const profileCount = await CompanyProfile.count();
    if (profileCount === 0) {
      await CompanyProfile.create({
        companyName: 'CV. Jaya Kencana',
        about: 'CV. Jaya Kencana adalah perusahaan yang bergerak di bidang konstruksi dan pengadaan barang industri.',
        vision: 'Menjadi mitra terpercaya dalam menyediakan solusi konstruksi dan industri terbaik.',
        mission: 'Memberikan layanan berkualitas tinggi dengan mengedepankan profesionalisme dan inovasi.',
        address: 'Jl. Contoh No. 123, Jakarta, Indonesia',
        phone: '+62 812-3456-7890',
        email: 'info@jayakencana.co.id',
        yearFounded: 2001,
        certifications: 'ISO 9001, ISO 14001',
        legalDocument: null
      });
      console.log('Default company profile created');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

bootstrap();
