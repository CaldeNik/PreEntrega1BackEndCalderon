import { Router } from 'express';
import ProductManager from '../classes/ProductsManager.class.js';

const router = Router();

const productManager = new ProductManager();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const product = await productManager.findProductById(id);
  res.send({ product });
});

router.get("/", async (req, res) => {
  const products = await productManager.findProduct();
  res.send({ products });
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const product = req.body;

  await productManager.createProduct(product);
  res.send({ status: "success" });
});

export default router;
