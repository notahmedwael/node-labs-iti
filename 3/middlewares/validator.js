const VALID_STATUSES = ['available', 'discontinued', 'on-sale']

// For POST: All fields required
export function validateProduct(req, res, next) {
  const { name, price, category, status, stock } = req.body

  if (!name || price === undefined || !category || !status || stock === undefined) {
    return res.status(400).json({ error: 'Missing required fields: name, price, category, status, stock' })
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be: ${VALID_STATUSES.join(', ')}` })
  }

  next()
}

// For PATCH: Validates only what is sent
export function validateStockAndUpdates(req, res, next) {
  const { action, amount, status, price } = req.body

  if ((action || amount) && (!action || !amount)) {
    return res.status(400).json({ error: 'Both action and amount are required for stock updates' })
  }

  if (action && !['restock', 'destock'].includes(action)) {
    return res.status(400).json({ error: 'Action must be restock or destock' })
  }

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' })
  }

  if (price !== undefined && typeof price !== 'number') {
    return res.status(400).json({ error: 'Price must be a number' })
  }

  next()
}
