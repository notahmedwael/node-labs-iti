import { Router } from 'express'
import { serveImage } from '../controllers/serveImage'

const router = Router()

router.get('/', serveImage)
