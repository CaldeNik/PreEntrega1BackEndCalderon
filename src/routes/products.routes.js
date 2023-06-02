import { Router } from 'express';
import ProductManager from '../classes/ProductsManager.class.js';

const router = Router();

const productManager = new ProductManager();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await productManager.findProductById(id);
  if (product) {
    res.send({ product });
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

router.get("/", async (req, res) => {
  const products = await productManager.findProduct();
  res.send({ products });
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
  const deletedProduct = await productManager.deleteProduct(id);
  if (deletedProduct !== null) {
    res.send({ message: "Producto eliminado correctamente" });
  } else {
    res.send({ message: "Producto no encontrado" });
  }
});

export default router;
