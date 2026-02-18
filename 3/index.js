/* eslint-disable no-console */
import path from 'node:path'
import express from 'express'
import { readProducts } from './helpers/jsonHandler.js'
import productRoutes from './routes/productRoutes.js'

const app = express()
app.use(express.json())

app.use(express.static(path.resolve('public')))

app.use('/products', productRoutes)

app.get('/', async (req, res) => {
  const products = await readProducts()
  const productCards = products.map(p => `
    <div style="
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 12px;
      box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
      background: #fff;
    ">
      <h3 style="margin-top: 0; color: #333;">${p.name}</h3>
      <span style="background: #e0f7fa; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">
        ${p.category}
      </span>
      <p>Price: <b>$${p.price}</b></p>
      <p style="color: ${p.stock < 5 ? 'red' : 'green'}">Stock: ${p.stock}</p>
    </div>
  `).join('')

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Product Gallery</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #f4f4f9; padding: 40px; }
          .container { max-width: 1000px; margin: 0 auto; }
          .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .hero-img { width: 150px; border-radius: 50%; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="/images/balloon.webp" alt="Store Logo" class="hero-img">
            <h1>Product Inventory</h1>
          </div>
          <div class="grid">
            ${productCards}
          </div>
        </div>
      </body>
    </html>
  `)
})

app.listen(5000, () => console.log('Server running on http://localhost:5000'))
