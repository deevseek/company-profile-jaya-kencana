const { Product } = require('../models');

const sanitizeContactNumber = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const digits = String(value).replace(/\D/g, '');
  return digits.length > 0 ? digits : null;
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const data = { ...req.body };
    if (!Object.prototype.hasOwnProperty.call(data, 'contactNumber') &&
        Object.prototype.hasOwnProperty.call(data, 'price')) {
      data.contactNumber = data.price;
      delete data.price;
    }

    if (Object.prototype.hasOwnProperty.call(data, 'contactNumber')) {
      data.contactNumber = sanitizeContactNumber(data.contactNumber);
    }
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }
    const product = await Product.create(data);
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const data = { ...req.body };
    if (!Object.prototype.hasOwnProperty.call(data, 'contactNumber') &&
        Object.prototype.hasOwnProperty.call(data, 'price')) {
      data.contactNumber = data.price;
      delete data.price;
    }

    if (Object.prototype.hasOwnProperty.call(data, 'contactNumber')) {
      data.contactNumber = sanitizeContactNumber(data.contactNumber);
    }
    if (req.file) {
      data.imageUrl = `/uploads/${req.file.filename}`;
    }
    await product.update(data);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
