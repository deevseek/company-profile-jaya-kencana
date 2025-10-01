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

const getUploadedFilePaths = (files, fieldName) => {
  if (!files || !files[fieldName] || files[fieldName].length === 0) {
    return [];
  }

  return files[fieldName].map((file) => `/uploads/${file.filename}`);
};

const parseExistingLegalDocuments = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to parse existing legal documents', error);
    return [];
  }
};

exports.createProfile = async (req, res) => {
  try {
    const data = { ...req.body };

    const heroImagePath = getUploadedFilePaths(req.files, 'heroImage');
    const legalDocumentPaths = getUploadedFilePaths(req.files, 'legalDocuments');
    const existingLegalDocuments = parseExistingLegalDocuments(req.body.existingLegalDocuments);

    delete data.existingLegalDocuments;
    delete data.legalDocument;
    delete data.legalDocuments;

    if (heroImagePath.length > 0) {
      data.heroImage = heroImagePath[0];
    }

    const mergedLegalDocuments = [...existingLegalDocuments, ...legalDocumentPaths];
    if (mergedLegalDocuments.length > 0) {
      data.legalDocument = mergedLegalDocuments;
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

    const data = { ...req.body };

    const heroImagePath = getUploadedFilePaths(req.files, 'heroImage');
    const legalDocumentPaths = getUploadedFilePaths(req.files, 'legalDocuments');
    const existingLegalDocuments = parseExistingLegalDocuments(req.body.existingLegalDocuments);

    delete data.existingLegalDocuments;
    delete data.legalDocument;
    delete data.legalDocuments;

    if (heroImagePath.length > 0) {
      data.heroImage = heroImagePath[0];
    }

    const mergedLegalDocuments = [...existingLegalDocuments, ...legalDocumentPaths];
    if (mergedLegalDocuments.length > 0) {
      data.legalDocument = mergedLegalDocuments;
    } else {
      data.legalDocument = [];
    }

    await profile.update(data);
    await profile.reload();
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
