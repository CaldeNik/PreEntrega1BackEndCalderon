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

  async getProducts(limit = 10, page = 1, sort = null, query = null) {
    try {
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : null,
        populate: {
          path: "products",
          select: "-_id -__v" // Excluir _id y __v de los productos
        }
      };

      const filter = query ? { category: query } : {};

      const result = await ProductsModel.paginate(filter, options);

      const totalPages = result.totalPages;
      const prevPage = result.hasPrevPage ? page - 1 : null;
      const nextPage = result.hasNextPage ? page + 1 : null;
      const hasPrevPage = result.hasPrevPage;
      const hasNextPage = result.hasNextPage;
      const prevLink = result.hasPrevPage ? `/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
      const nextLink = result.hasNextPage ? `/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;

      return {
        status: "success",
        payload: result.docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink
      };
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      return {
        status: "error",
        payload: null
      };
    }
  }

  async findProductById(id) {
    try {
      const result = await ProductsModel.findById(id);
      return {
        status: "success",
        payload: result
      };
    } catch (error) {
      console.error("Error al buscar el producto por ID:", error);
      return {
        status: "error",
        payload: null
      };
    }
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
