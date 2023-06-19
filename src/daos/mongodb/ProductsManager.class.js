import mongoose from "mongoose";
import { ProductsModel } from "./models/products.model.js";

export default class ProductManager {
  constructor() {
    this.connect();
  }

  async connect() {
    try {
      await mongoose.connect('mongodb+srv://nicoocalderon:ZULFA9-02trx@cluster0.oz9dipu.mongodb.net/');
      console.log("Conexión exitosa a la base de datos");
    } catch (error) {
      console.error("Error al conectar a la base de datos:", error);
    }
  }

  async createProduct(product) {
    let result = await ProductsModel.create(product);
    return result;
  }

  async findProduct(limit = null) {
    let result = await ProductsModel.find();
    return result;
  }

  async findProductById(id) {
    let result = await ProductsModel.findOne({ _id: id });
    return result;
  }

  async updateProduct(id, updatedProduct) {
    let result = await ProductsModel.updateOne(
      { _id: id },
      { $set: updatedProduct }
    );
    return result;
  }

  async deleteProductById(id) {
    let result = await ProductsModel.deleteOne({ _id: id });
    return result;
  }
}
