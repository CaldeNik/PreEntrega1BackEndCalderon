import fs from "fs";
import { v4 as uuidV4 } from "uuid";

const path = "src/classes/files/carts.json";

export default class CartManager {
  findCart = async () => {
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
    await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
    return carts;
  };

  findCartById = async (id) => {
    const carts = await this.findCart();

    const cart = carts.find((cart) => {
      return cart.id == id;
    });

    return cart ? cart : "Cart Not Found";
  };

  addProductToCart = async (idCart, idProduct) => {
    const cart = await this.findCartById(idCart);

    const index = cart.products.findIndex((product) => {
      return product.id == idProduct;
    });

    if (index === -1) {
      cart.products.push({ id: idProduct, quantity: 1 });
    } else {
      cart.products[index].quantity++;
    }

    const carts = await this.findCart();
    const cartIndex = carts.findIndex((cartIterator) => {
      return cartIterator.id == cart.id;
    });

    carts[cartIndex] = cart;

    await fs.promises.writeFile(path, JSON.stringify(carts, null, "\t"));
    return carts;
  };
}
