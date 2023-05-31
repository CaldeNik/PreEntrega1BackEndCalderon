import { Router } from "express";
import CartManager from "../classes/CartManager.class.js";

const router = Router();
const cartManager = new CartManager();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const cart = await cartManager.findCartById(id);
  res.send(cart);
});

router.get("/", async (req, res) => {
  const carts = await cartManager.findCart();
  res.send(carts);
});

router.post("/", async (req, res) => {
  await cartManager.createCart();
  res.send({ status: "success" });
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  await cartManager.addProductToCart(cartId, productId);
  res.send({ status: "success" });
});

export default router;
