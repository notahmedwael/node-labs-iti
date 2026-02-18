import * as db from '../helpers/jsonHandler.js'

export async function getProducts(req, res) {
  let products = await db.readProducts()
  const { status, category } = req.query

  if (status)
    products = products.filter(p => p.status === status)
  if (category)
    products = products.filter(p => p.category === category)

  res.json(products)
}

export async function getOne(req, res) {
  const products = await db.readProducts()
  const product = products.find(p => p.id === Number(req.params.id))
  product ? res.json(product) : res.status(404).json({ error: 'Product not found' })
}

export async function create(req, res) {
  const products = await db.readProducts()
  const newProduct = { id: Date.now(), ...req.body }
  products.push(newProduct)
  await db.writeProducts(products)
  res.status(201).json(newProduct)
}

export async function patchProduct(req, res) {
  const products = await db.readProducts()
  const productId = Number(req.params.id)
  const index = products.findIndex(p => p.id === productId)

  if (index === -1)
    return res.status(404).json({ error: 'Product not found' })

  const { action, amount, ...updates } = req.body
  const product = products[index]

  if (action === 'restock') {
    product.stock += amount
  }
  else if (action === 'destock') {
    if (product.stock < amount)
      return res.status(400).json({ error: 'Insufficient stock' })
    product.stock -= amount
  }

  products[index] = { ...product, ...updates }
  await db.writeProducts(products)
  res.json(products[index])
}

export async function deleteProduct(req, res) {
  const products = await db.readProducts()
  const targetId = Number(req.params.id)
  const filtered = products.filter(p => p.id !== targetId)

  if (products.length === filtered.length) {
    return res.status(404).json({ error: 'Product not found' })
  }

  await db.writeProducts(filtered)
  res.status(204).send()
}
