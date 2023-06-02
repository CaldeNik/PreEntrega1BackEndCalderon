import express from 'express';
import exphbs from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { __dirname } from './utils.js';
import path from 'path';
import ProductManager from './classes/ProductsManager.class.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

const productManager = new ProductManager();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.get('/', async (req, res) => {
  const products = await productManager.findProduct();
  res.render('home', { products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.findProduct();
  res.render('realTimeProducts', { products });
});

app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  const productData = req.body;
  const updatedProduct = await productManager.updateProduct(id, productData);
  if (updatedProduct) {
    const products = await productManager.findProduct();
    io.emit('updateProducts', products);
    res.send({ product: updatedProduct });
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  await productManager.deleteProduct(id);
  const products = await productManager.findProduct();
  io.emit('updateProducts', products);
  res.send({ status: 'success' });
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('createProduct', async (product) => {
    await productManager.createProduct(product);
    const products = await productManager.findProduct();
    io.emit('updateProducts', products);
  });

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const products = await productManager.findProduct();
    io.emit('updateProducts', products);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
