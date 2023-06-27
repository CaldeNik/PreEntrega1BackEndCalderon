import { Router } from "express";
import CartManager from "../daos/mongodb/CartManager.class.js";

const router = Router();
const cartManager = new CartManager();

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await cartManager.findCartById(id);
    if (cart) {
      res.send(cart);
    } else {
      res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al buscar el carrito" });
  }
});

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.findCarts();
    res.send(carts);
  } catch (error) {
    res.status(500).send({ error: "Error al obtener los carritos" });
  }
});

router.post("/", async (req, res) => {
  try {
    await cartManager.createCart();
    res.send({ status: "success" });
  } catch (error) {
    res.status(500).send({ error: "Error al crear el carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  try {
    await cartManager.addProductToCart(cartId, productId);
    res.send({ status: "success" });
  } catch (error) {
    res.status(500).send({ error: "Error al agregar el producto al carrito" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedCart = await cartManager.deleteCart(id);
    if (deletedCart.deletedCount > 0) {
      res.send({ message: "Carrito eliminado correctamente" });
    } else {
      res.status(404).send({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).send({ error: "Error al eliminar el carrito" });
  }
});

export default router;
