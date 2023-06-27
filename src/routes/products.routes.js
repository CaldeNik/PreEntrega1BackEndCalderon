import { Router } from 'express';
import ProductManager from '../daos/mongodb/ProductsManager.class.js';
import CartManager from '../daos/mongodb/CartManager.class.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await productManager.findProductById(id);
  if (product) {
    res.render("product-details", { product });
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

router.get("/", async (req, res) => {
  const products = await productManager.findProduct();
  res.render("products", { products });
});

router.post("/", async (req, res) => {
  const product = req.body;
  await productManager.createProduct(product);
  res.send({ status: "success" });
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const productData = req.body;
  const updatedProduct = await productManager.updateProduct(id, productData);
  if (updatedProduct) {
    res.send({ product: updatedProduct });
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deletedProduct = await productManager.deleteProductById(id);
  if (deletedProduct !== null) {
    res.send({ message: "Producto eliminado correctamente" });
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

router.post("/:id/add-to-cart", async (req, res) => {
  const productId = req.params.id;
  const cart = await cartManager.createCart();
  await cartManager.addProductToCart(cart._id, productId);
  res.redirect("/carts/" + cart._id);
});

export default router;
