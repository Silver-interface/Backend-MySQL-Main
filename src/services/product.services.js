import Producto from "../models/productModel.js";
import Color from '../models/colorModel.js';
import Talla from '../models/tallaModel.js';
import Seccion from '../models/seccionModel.js';
import Marca from "../models/marcaModel.js";
import Inventario from "../models/inventarioModel.js";

const insertProducto = async (productoData) => {
  console.log(productoData);
  try {
    // Verificar si la marca existe, si no existe, crearla
    let marca = await Marca.findOne({ where: { NOMBRE_MARCA: productoData.marca.NOMBRE_MARCA } });
    if (!marca) {
      marca = await Marca.create({ NOMBRE_MARCA: productoData.marca.NOMBRE_MARCA });
    }
    // Verificar si el color existe, si no existe, crearlo
    let color = await Color.findOne({ where: { NOMBRE_COLOR: productoData.color.NOMBRE_COLOR } });
    if (!color) {
      color = await Color.create({ NOMBRE_COLOR: productoData.color.NOMBRE_COLOR, CODIGO_COLOR: productoData.color.CODIGO_COLOR });
    }
    // Establecer los datos del producto
    const newProducto = await Producto.create({
      IMAGEN: productoData.IMAGEN,
      NOMBRE_PRODUCTO: productoData.NOMBRE_PRODUCTO,
      DESCRIPCION: productoData.DESCRIPCION,
      PRECIO: productoData.PRECIO,
      ID_SECCION: productoData.ID_SECCION,
      ID_TALLA: productoData.ID_TALLA,
      ID_MARCA: marca.ID_MARCA,
      ID_COLOR: color.ID_COLOR
    });
    await newProducto.save();

    // Actualizar los datos del inventario
    await Promise.all(productoData.inventario.map(async (item) => {
      await Inventario.create({
        ID_PRODUCTO: newProducto.ID_PRODUCTO,
        ID_TALLA: item.ID_TALLA,
        STOCK: item.STOCK
      });
    }));
    return newProducto;

  } catch (error) {
    throw new Error(`Error al insertar el producto: ${error.message}`);
  }
};

const getProductos = async () => {  //aca
  try {
    const productos = await Producto.findAll();
    return productos;
  } catch (error) {
    throw new Error(`Error al obtener los productos: ${error.message}`);
  }
};

const getProductoById = async (id) => {
  try {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    return producto;
  } catch (error) {
    throw new Error(`Error al obtener el producto: ${error.message}`);
  }
};

const getCantidadProductoById = async (ID_PRODUCTO) => {
  try {
    const producto = await Producto.findByPk(ID_PRODUCTO);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    const cantidad = producto.STOCK;
    return cantidad;
  } catch (error) {
    throw new Error(`Error al obtener la cantidad del producto: ${error.message}`);
  }
};

const updateProducto = async (newData) => {
  try {
    let producto = await Producto.findByPk(newData.ID_PRODUCTO, {
      include: [{ model: Inventario, as: 'inventario' }]
    });

    //Funcionalidad para la funcion restarCantidadProducto del detalleVenta
    //Actualizar el stock en la tabla producto
    producto.STOCK = newData.STOCK;
    // Actualizar el stock en la tabla Inventarios
    if (producto.inventario.length > 0) {
      for (const inventarioItem of producto.inventario) {
        if (newData.inventario && newData.inventario[inventarioItem.ID_TALLA]) {
          inventarioItem.STOCK = newData.inventario[inventarioItem.ID_TALLA];
          await inventarioItem.save();
        }
      }
    }
    // Actualizar los datos del producto del rol Administrador
    if (!newData.hasOwnProperty('STOCK')) {
      // Actualizar los datos del inventario
      if (newData.inventario) {
        for (const item of newData.inventario) {
          const inventarioItem = producto.inventario.find(i => i.ID_TALLA === item.ID_TALLA);
          if (inventarioItem) {
            await inventarioItem.update({ STOCK: item.STOCK });
          }
        }
      }
      // Calcular el stock total de la tabla producto de acuerdo a la cantidad total segun la talla de la tabla inventario
      let stockTotal = 0;
      for (const inventarioItem of producto.inventario) {
        stockTotal += parseInt(inventarioItem.STOCK);
      }
      // Verificar si la marca existe, si no existe, crearla
      let marca = await Marca.findOne({ where: { NOMBRE_MARCA: newData.marca.NOMBRE_MARCA } });
      if (!marca) {
        marca = await Marca.create({ NOMBRE_MARCA: newData.marca.NOMBRE_MARCA });
      }
      // Verificar si el color existe, si no existe, crearlo
      let color = await Color.findOne({ where: { NOMBRE_COLOR: newData.color.NOMBRE_COLOR } });
      if (!color) {
        color = await Color.create({ NOMBRE_COLOR: newData.color.NOMBRE_COLOR, CODIGO_COLOR: newData.color.CODIGO_COLOR });
      }
      producto.IMAGEN = newData.IMAGEN;
      producto.NOMBRE_PRODUCTO = newData.NOMBRE_PRODUCTO;
      producto.DESCRIPCION = newData.DESCRIPCION;
      producto.PRECIO = newData.PRECIO;
      producto.ID_SECCION = newData.ID_SECCION;
      producto.ID_MARCA = marca.ID_MARCA;
      producto.ID_COLOR = color.ID_COLOR;
      producto.STOCK = stockTotal.toString();
    }

    await producto.save();
    return producto;
  } catch (error) {
    throw new Error(`Error al actualizar el producto: ${error.message}`);
  }
};



const deleteProducto = async (ID_PRODUCTO) => {
  console.log(ID_PRODUCTO);
  try {
    // Eliminar los registros de la tabla 'inventario' que tienen el 'ID_PRODUCTO' dado
    await Inventario.destroy({
      where: {
        ID_PRODUCTO: ID_PRODUCTO
      }
    });

    // Eliminar el producto de la tabla 'producto' utilizando su 'ID_PRODUCTO'
    const producto = await Producto.findByPk(ID_PRODUCTO);
    if (!producto) {
      throw new Error("Producto no encontrado");
    }
    await producto.destroy();

    return producto;
  } catch (error) {
    throw new Error(`Error al eliminar el producto: ${error.message}`);
  }
};



const getProductDetail = async () => {
  try {
    const productosDetail = await Producto.findAll({
      include: [
        { model: Color, as: 'color' },
        { model: Seccion, as: 'seccion' },
        { model: Marca, as: 'marca' },
        {
          model: Inventario,
          as: 'inventario',
          include: [{ model: Talla, as: 'talla' }]
        }
      ]
    });

    return productosDetail;
  } catch (error) {
    console.error('Error al obtener los productos completos en el servicio:', error);
    throw new Error('Error al obtener los productos completos en el servicio');
  }
};

export { getProductoById, insertProducto, getProductos, updateProducto, deleteProducto, getProductDetail, getCantidadProductoById };
