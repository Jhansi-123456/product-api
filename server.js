const express = require('express');

const app = express();

// Read configuration from environment variables
const APP_ENV = process.env.APP_ENV || 'development';
const DB_HOST = process.env.DB_HOST || 'not-configured';
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());

// Temporary in-memory product data
let products = [
    {
        id: 1,
        name: 'Laptop',
        price: 75000,
        category: 'Electronics'
    },
    {
        id: 2,
        name: 'Smartphone',
        price: 45000,
        category: 'Electronics'
    }
];

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Product API is running'
    });
});

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        environment: APP_ENV,
        database: DB_HOST,
        port: PORT
    });
});

// GET all products
app.get('/products', (req, res) => {
    res.json(products);
});

// GET product by ID
app.get('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    res.json(product);
});

// POST - Add a new product
app.post('/products', (req, res) => {
    const { name, price, category } = req.body;

    if (!name || price === undefined || !category) {
        return res.status(400).json({
            message: 'name, price and category are required'
        });
    }

    const newProduct = {
        id: products.length > 0
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name,
        price,
        category
    };

    products.push(newProduct);

    res.status(201).json(newProduct);
});

// PUT - Update an existing product
app.put('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    const { name, price, category } = req.body;

    products[productIndex] = {
        id,
        name: name || products[productIndex].name,
        price: price !== undefined ? price : products[productIndex].price,
        category: category || products[productIndex].category
    };

    res.json(products[productIndex]);
});

// DELETE - Delete a product
app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    const deletedProduct = products.splice(productIndex, 1);

    res.json({
        message: 'Product deleted successfully',
        product: deletedProduct[0]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Product API running on port ${PORT}`);
    console.log(`Environment: ${APP_ENV}`);
    console.log(`Database Host: ${DB_HOST}`);
});