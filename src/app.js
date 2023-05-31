import express from 'express';
import exphbs from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { __dirname } from './utils.js';
import ProductManager from './classes/ProductsManager.class.js'; // Importar ProductManager

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

// Crear instancia de ProductManager
const productManager = new ProductManager();

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Endpoint para la vista home
app.get('/', async (req, res) => {
  const products = await productManager.findProduct();
  res.render('home', { products });
});

// Endpoint para la vista realTimeProducts
app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.findProduct();
  res.render('realTimeProducts', { products });
});

// Conexión de sockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escuchar evento de creación de un producto desde el formulario
  socket.on('createProduct', async (product) => {
    await productManager.createProduct(product);
    const products = await productManager.findProduct();
    io.emit('updateProducts', products);
  });

  // Escuchar evento de eliminación de un producto
  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const products = await productManager.findProduct();
    io.emit('updateProducts', products);
  });

  // Manejar desconexión de un cliente
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
