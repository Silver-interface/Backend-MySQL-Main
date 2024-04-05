import express from 'express';
import { getVenta, getVentas, updateVenta, insertVenta, deleteVenta } from '../controller/registroVentaController.js';

const router = express.Router();

// Rutas para ventas
router.get('/ventas/:id', getVenta);
router.get('/ventas', getVentas);
router.post('/ventas', insertVenta);
router.put('/ventas/:id', updateVenta);
router.delete('/ventas/:id', deleteVenta);

export default router;