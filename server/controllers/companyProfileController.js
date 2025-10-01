const { CompanyProfile } = require('../models');

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await CompanyProfile.findAll();
    res.json(profiles);
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createProfile = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.heroImage = `/uploads/${req.file.filename}`;
    }
    const profile = await CompanyProfile.create(data);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const data = req.body;
    if (req.file) {
      data.heroImage = `/uploads/${req.file.filename}`;
    }

    await profile.update(data);
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findByPk(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    await profile.destroy();
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
