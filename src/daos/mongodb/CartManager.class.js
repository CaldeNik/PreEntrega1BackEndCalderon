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
    cart.products.push({ product: product });
    await cart.save();
    return;
  }
}
