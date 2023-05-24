import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/', (req, res) => {
  const { limit } = req.query;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));

  if (limit) {
    const limitedProducts = products.slice(0, parseInt(limit));
    res.json(limitedProducts);
  } else {
    res.json(products);
  }
});

router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const product = products.find((p) => p.id === parseInt(pid));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

router.post('/', (req, res) => {
  const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    res.status(400).json({ error: 'Faltan campos obligatorios' });
    return;
  }

  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const id = uuidv4();
  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);

  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(newProduct);
});

router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    res.status(400).json({ error: 'Faltan campos obligatorios' });
    return;
  }

  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const productIndex = products.findIndex((p) => p.id === parseInt(pid));

  if (productIndex === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  const updatedProduct = {
    id: pid,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };

  products[productIndex] = updatedProduct;

  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
  const { pid } = req.params;

  const products = JSON.parse(fs.readFileSync('productos.json', 'utf8'));
  const productIndex = products.findIndex((p) => p.id === parseInt(pid));

  if (productIndex === -1) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }

  const deletedProduct = products.splice(productIndex, 1)[0];

  fs.writeFileSync('productos.json', JSON.stringify(products, null, 2));

  res.json(deletedProduct);
});

export default router;
