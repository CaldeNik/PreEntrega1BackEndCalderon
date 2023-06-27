import mongoose from "mongoose";
import { CartModel } from "./models/carts.model.js";
import ProductManager from "./ProductsManager.class.js";

export default class CartManager {
  constructor() {
    this.connect();
    this.productManager = new ProductManager();
  }

  async connect() {
    try {
      await mongoose.connect('mongodb+srv://nicoocalderon:ZULFA9-02trx@cluster0.oz9dipu.mongodb.net/');
      console.log("Conexión exitosa a la base de datos");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
    }
  }

  async createCart() {
    const result = await CartModel.create({ products: [] });
    return result;
  }

  async findCarts() {
    const result = await CartModel.find();
    return result;
  }

  async findCartById(id) {
    const result = await CartModel.findOne({ _id: id }).populate('products.product');
    return result;
  }

  async addProductToCart(idCart, idProduct) {
    const product = await this.productManager.findProductById(idProduct);
    const cart = await this.findCartById(idCart);
  
    const existingProduct = cart.products.find(p => p.product._id.toString() === product._id.toString());
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }
  
    await cart.save();
    return;
  }
  
  async deleteCart(id) {
    const result = await CartModel.deleteOne({ _id: id });
    return result;
  }
}
