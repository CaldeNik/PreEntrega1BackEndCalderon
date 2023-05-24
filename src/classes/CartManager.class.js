import fs from "fs";
import { v4 as uuidV4 } from "uuid";

const path = "src/classes/files/carts.json";

export default class CartManager {
    consultarCarts = async () => {
      console.log("existe", fs.existsSync(path));
      if (fs.existsSync(path)) {
        const data = await fs.promises.readFile(path, "utf-8");
        const carts = JSON.parse(data);
        return carts;
      } else {
        return [];
      }
    };
  
    createCart = async () => {
      const carts = await this.findCart();
      carts.push({ id: uuidV4(), products: [] });
      return await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
    };
  
    findCartById = async (id) => {
      const carts = await this.findCart();
  
      const cart = carts.find((cart) => {
        return cart.id == id;
      });
  
      return cart ? cart : "Product Not Found";
    };
  }