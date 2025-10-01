const { Gallery } = require('../models');

exports.getGallery = async (req, res) => {
  try {
    const galleryItems = await Gallery.findAll();
    res.json(galleryItems);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }
    const item = await Gallery.create(data);
    res.status(201).json(item);
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    const data = req.body;
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }
    await item.update(data);
    res.json(item);
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    await item.destroy();
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
