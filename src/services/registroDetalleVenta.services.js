import DetalleVenta from "../models/detalleVentaModel.js";
import { getCantidadProductoById, getProductDetail, getProductoById, getProductos, updateProducto } from "./product.services.js";
import Producto from "../models/productModel.js";
import Inventario from "../models/inventarioModel.js";
import Color from "../models/colorModel.js";
import Seccion from "../models/seccionModel.js";
import Marca from "../models/marcaModel.js";
import Talla from "../models/tallaModel.js";

const getCantidadProductoByIda = async (producto) => {
  try {
    const cantidadProducto = await getCantidadProductoById(producto.ID_PRODUCTO);
    return cantidadProducto;
  } catch (error) {
    throw new Error(`Error al obtener la cantidad del producto: ${error.message}`);
  }
};

const restarCantidadProducto = async (producto) => {
  try {
    let actualizarCantidad = 0;
    const cantidadProducto = await getCantidadProductoByIda(producto);

    actualizarCantidad = cantidadProducto - producto.CANTIDAD;
    const productoActualizado = {
      ID_PRODUCTO: producto.ID_PRODUCTO,
      STOCK: actualizarCantidad,
    };

  
    await updateProducto(productoActualizado);

    // Obtener la talla específica del producto en el inventario
    const tallaInventario = await Inventario.findOne({
      where: {
        ID_PRODUCTO: producto.ID_PRODUCTO,
        ID_TALLA: producto.ID_TALLA
      }
    });

    // Restar la cantidad vendida del stock de la talla específica
    tallaInventario.STOCK -= producto.CANTIDAD;
    await tallaInventario.save();

    // Verificar si el stock general llegó a cero
    if (actualizarCantidad === 0) {
      // Eliminar el producto del inventario y la tabla de productos si no hay más stock
      await Inventario.destroy({ where: { ID_PRODUCTO: producto.ID_PRODUCTO } });
      await Producto.destroy({ where: { ID_PRODUCTO: producto.ID_PRODUCTO } });
    }
    return actualizarCantidad;

  } catch (error) {
    throw new Error(`Error al restar la cantidad del producto: ${error.message}`);
  }
};



const insertDetalleVenta = async (detalleVentaData, IdVenta) => {
  try {
    const detalleVenta = await DetalleVenta.create({ ...detalleVentaData, ID_VENTA: IdVenta });
    return detalleVenta;
  } catch (error) {
    throw new Error(`Error al insertar el detalle de venta: ${error.message}`);
  }
};

const obtenerProductosMasVendidos = async () => {
  try {
    const detallesVentas = await DetalleVenta.findAll(); // Obtener todos los detalles de venta
    const productosMasVendidosIds = {}; // Crear un objeto para almacenar la cantidad vendida por producto

    // Calcular la cantidad vendida por producto
    detallesVentas.forEach((detalle) => {
      const productoId = detalle.ID_PRODUCTO;
      if (productosMasVendidosIds[productoId]) {
        productosMasVendidosIds[productoId] += detalle.CANTIDAD;
      } else {
        productosMasVendidosIds[productoId] = detalle.CANTIDAD;
      }
    });

    // Ordenar los productos según la cantidad vendida (de mayor a menor)
    const productosOrdenados = Object.keys(productosMasVendidosIds).sort(
      (a, b) => productosMasVendidosIds[b] - productosMasVendidosIds[a]
    );

    // Obtener los IDs de los productos más vendidos
    const productosMasVendidosIdsSlice = productosOrdenados.slice(0, 5);

    // Consultar los detalles completos de los productos más vendidos
    const productosMasVendidos = await Promise.all(
      productosMasVendidosIdsSlice.map(async (id) => {
        const producto = await Producto.findByPk(id, {
          include: [
            { model: Color, as: 'color' },
            { model: Seccion, as: 'seccion' },
            { model: Marca, as: 'marca' },
            {
              model: Inventario, as: 'inventario',
              include: [{ model: Talla, as: 'talla' }]
            }
          ]
        });
        return producto.toJSON(); // Convertir el objeto sequelize a JSON
      })
    );

    return productosMasVendidos;
  } catch (error) {
    throw new Error(`ERROR_GET_PRODUCTOS_MAS_VENDIDOS: ${error.message}`);
  }
};

const getDetalleVentas = async () => {
  try {
    const detalleVentas = await DetalleVenta.findAll();
    return detalleVentas;
  } catch (error) {
    throw new Error(`Error al obtener las Detalle de la Ventas: ${error.message}`);
  }
};

const getDetalleVentaById = async (id) => {
  try {
    const detalleVenta = await DetalleVenta.findByPk(id);
    if (!detalleVenta) {
      throw new Error("DetalleVenta no encontrada");
    }
    return detalleVenta;
  } catch (error) {
    throw new Error(`Error al obtener la DetalleVenta: ${error.message}`);
  }
};

const updateDetalleVenta = async (id, newData) => {
  try {
    const detalleVenta = await DetalleVenta.findByPk(id);
    if (!detalleVenta) {
      throw new Error("DetalleVenta no encontrada");
    }
    await DetalleVenta.update(newData);
    return DetalleVenta;
  } catch (error) {
    throw new Error(`Error al actualizar la DetalleVenta: ${error.message}`);
  }
};

const deleteDetalleVenta = async (ID_PRODUCTO) => {
  try {
    const detalleVenta = await DetalleVenta.findByPk(ID_PRODUCTO);
    if (!detalleVenta) {
      throw new Error("DetalleVenta no encontrada");
    }
    await DetalleVenta.destroy();
    return detalleVenta;
  } catch (error) {
    throw new Error(`Error al eliminar la DetalleVenta: ${error.message}`);
  }
};

export { insertDetalleVenta, getDetalleVentas, getDetalleVentaById, updateDetalleVenta, deleteDetalleVenta, restarCantidadProducto, obtenerProductosMasVendidos };
