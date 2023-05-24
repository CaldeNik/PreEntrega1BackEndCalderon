import fs from 'fs';

const path = 'src/classes/files/products.json';

export default class ProductManager {
  findProduct = async (limit) => {
    if (fs.existsSync(path)) {
      const data = await fs.promises.readFile(path, 'utf-8');
      const products = JSON.parse(data);

      if (limit) {
        return products.slice(0, limit);
      }

      return products;
    } else {
      return [];
    }
  };

  createProduct = async (info) => {
    const products = await this.findProduct();
    if (products.length === 0) {
      info.id = 1;
    } else {
      info.id = products[products.length - 1].id + 1;
    }

    products.push(info);
    await fs.promises.writeFile(path, JSON.stringify(products,null,'\t'));
  };

  deleteProduct = async (id) => {
    const products = await this.findProduct();
    const filteredProducts = products.filter((product) => {
      return product.id != id;
    });
    await fs.promises.writeFile(path, JSON.stringify(filteredProducts,null,'\t'));
  };

  findProductById = async (id) => {
    const products = await this.findProduct();
    const searchProduct = products.find((product) => {
      return product.id == id;
    });
    return searchProduct ? searchProduct : 'Product not found';
  };
}
