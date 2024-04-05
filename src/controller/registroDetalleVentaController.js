import { insertDetalleVenta, getDetalleVentas, getDetalleVentaById, updateDetalleVenta, deleteDetalleVenta, obtenerProductosMasVendidos } from "../services/registroDetalleVenta.services.js";

const getDetalleVentaId = async (req, res) => {
  try {
    const { id } = req.params;
    const detalleVenta = await getDetalleVentaById(id);
    if (!detalleVenta) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }
    res.json(detalleVenta);
  } catch (error) {
    res.status(500).json({ error: "ERROR_GET_DETALLE_VENTA" });
  }
};

const getDetalleVentasAll = async (req, res) => {
  try {
    const detalleVentas = await getDetalleVentas();
    res.json(detalleVentas);
  } catch (error) {
    res.status(500).json({ error: "ERROR_GET_DETALLE_VENTAS" });
  }
};

const updateDetalleVentaU = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const updatedDetalleVenta = await updateDetalleVenta(id, newData);
    res.json(updatedDetalleVenta);
  } catch (error) {
    res.status(500).json({ error: "ERROR_UPDATE_DETALLE_VENTA" });
  }
};

const insertDetalleVentaN = async (req, res) => {
  try {
    const { listaDetalleVenta, IdVenta } = req.body;
    const detalleVentas = await insertDetalleVenta(listaDetalleVenta, IdVenta);
    res.json(detalleVentas);
  } catch (error) {
    res.status(500).json({ error: `Error al insertar el detalle de venta: ${error.message}` });
  }
};

const deleteDetalleVentaD = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDetalleVenta = await deleteDetalleVenta(id);
    res.json(deletedDetalleVenta);
  } catch (error) {
    res.status(500).json({ error: "ERROR_DELETE_DETALLE_VENTA" });
  }
};

const obtenerProductosMasVendidosController = async (req, res) => {
  try {
    const productosMasVendidos = await obtenerProductosMasVendidos();
    res.json(productosMasVendidos);
  } catch (error) {
    res.status(500).json({ error: "ERROR_GET_PRODUCTOS_MAS_VENDIDOS" });
  }
};

export { getDetalleVentaId, getDetalleVentasAll, updateDetalleVentaU, insertDetalleVentaN, deleteDetalleVentaD, obtenerProductosMasVendidosController };
