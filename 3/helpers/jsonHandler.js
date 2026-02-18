/* eslint-disable antfu/top-level-function */
import fs from 'node:fs/promises'
import path from 'node:path'

const DATA_PATH = path.resolve('data/products.json')

export const readProducts = async () => {
  const data = await fs.readFile(DATA_PATH, 'utf-8')
  return JSON.parse(data || '[]')
}

export const writeProducts = async (data) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2))
}
