import { insertDetalleVenta } from "../services/registroDetalleVenta.services.js";
import { insertVenta as insertVentaService, getVentas as getVentasService, getVentaById as getVentaByIdService, updateVenta as updateVentaService, deleteVenta as deleteVentaService } from "../services/registroVenta.services.js";
import { restarCantidadProducto } from "../services/registroDetalleVenta.services.js";

const getVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await getVentaByIdService(id);
    if (!venta) {
      return res.status(404).json({ error: "NOT_FOUND" });
    }
    res.json(venta);
  } catch (error) {
    res.status(500).json({ error: "ERROR_GET_VENTA" });
  }
};

const getVentas = async (req, res) => {
  try {
    const ventas = await getVentasService();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: "ERROR_GET_VENTAS" });
  }
};

const updateVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const newData = req.body;
    const updatedVenta = await updateVentaService(id, newData);
    res.json(updatedVenta);
  } catch (error) {
    res.status(500).json({ error: "ERROR_UPDATE_VENTA" });
  }
};

const insertVenta = async (req, res) => {
  try {
    const ventaData = req.body; //venta principal
    const newVenta = await insertVentaService(ventaData); // Insertar la venta principal

    // Verificar si el carrito de compras está presente y es un array
    if (Array.isArray(ventaData.cart)) {
      const detallesVentaPromises = [];
      // Iterar sobre cada producto en el carrito de compras
      for (const producto of ventaData.cart) {
        const detalleVentaData = {
          ID_VENTA: newVenta.ID_VENTA,
          ID_PRODUCTO: producto.ID_PRODUCTO,
          ID_TALLA: producto.ID_TALLA,
          CANTIDAD: producto.CANTIDAD,
          ESTADO_ENVIO: ventaData.ESTADO_ENVIO,
          PRECIO: producto.PRECIO * producto.CANTIDAD
        };
        // Agregar la promesa de inserción del detalle de venta al array
        detallesVentaPromises.push(insertDetalleVenta(detalleVentaData, newVenta.ID_VENTA));
      }
      await Promise.all(detallesVentaPromises);
      //Actualizar el stock de los productos despues de completar la venta
      for (const producto of ventaData.cart){
        await restarCantidadProducto(producto);
        console.log("stock actualizado");
      } 
    } else {
      throw new Error("El carrito de compras no es válido.");
    }

    res.status(201).json(newVenta);
  } catch (error) {
    res.status(500).json({ error: `ERROR_INSERT_VENTA: ${error.message}` });
  }
};

const deleteVenta = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVenta = await deleteVentaService(id);
    res.json(deletedVenta);
  } catch (error) {
    res.status(500).json({ error: "ERROR_DELETE_VENTA" });
  }
};

export { getVenta, getVentas, updateVenta, insertVenta, deleteVenta };

