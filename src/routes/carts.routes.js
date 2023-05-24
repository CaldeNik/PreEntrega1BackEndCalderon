import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', (req, res) => {
  const { products } = req.body;
  const cartId = uuidv4();
  const newCart = {
    id: cartId,
    products: products || [],
  };

  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));
  carts.push(newCart);

  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));

  res.json(newCart);
});

router.get('/:cid', (req, res) => {
  const { cid } = req.params;

  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));
  const cart = carts.find((c) => c.id === cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/:cid/products/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity) {
    res.status(400).json({ error: 'Falta la cantidad del producto' });
    return;
  }

  const carts = JSON.parse(fs.readFileSync('carrito.json', 'utf8'));
  const cartIndex = carts.findIndex((c) => c.id === cid);

  if (cartIndex === -1) {
    res.status(404).json({ error: 'Carrito no encontrado' });
    return;
  }

  const cart = carts[cartIndex];
  const productIndex = cart.products.findIndex((p) => p.product === pid);

  if (productIndex === -1) {
    cart.products.push({ product: pid, quantity });
  } else {
    cart.products[productIndex].quantity += quantity;
  }

  fs.writeFileSync('carrito.json', JSON.stringify(carts, null, 2));

  res.json(cart.products);
});

export default router;
