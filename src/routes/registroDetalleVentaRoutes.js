import express from 'express';
import { getDetalleVentaId, getDetalleVentasAll, updateDetalleVentaU, insertDetalleVentaN, deleteDetalleVentaD,  obtenerProductosMasVendidosController} from '../controller/registroDetalleVentaController.js';

const router = express.Router();

// Rutas para detalles de ventas
router.get('/detalleventas/:id', getDetalleVentaId);
router.get('/detalleventas', getDetalleVentasAll);
router.post('/detalleventas', insertDetalleVentaN);
router.put('/detalleventas/:id', updateDetalleVentaU);
router.delete('/detalleventas/:id', deleteDetalleVentaD);
router.get('/destacados', obtenerProductosMasVendidosController );

export default router;