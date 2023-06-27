import mongoose from "mongoose";
import { cartModel } from "./models/carts.model.js";
import ProductManager from "./ProductsManager.class.js";

export default class CartManager {
  constructor() {
    this.connection = mongoose.connect('mongodb+srv://nicoocalderon:ZULFA9-02trx@cluster0.oz9dipu.mongodb.net/');
    this.productManager = new ProductManager();
  }

  async createCart() {
    const result = await cartModel.create({ products: [] });
    return result;
  }

  async findCarts() {
    const result = await cartModel.find();
    return result;
  }

  async findCartById(id) {
    const result = await cartModel.findOne({ _id: id });
    return result;
  }

  async addProductToCart(idCart, idProduct) {
    const product = await this.productManager.findProductById(idProduct);
    const cart = await this.findCartById(idCart);
  
    const existingProduct = cart.products.find(p => p.product.toString() === product._id.toString());
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: product, quantity: 1 });
    }
  
    await cart.save();
    return;
  }
  
  async deleteCart(id) {
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  }
}
