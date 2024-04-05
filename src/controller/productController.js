import { insertProducto as insertProduct, getProductos as getProducts, getProductoById, updateProducto as updateProduct, deleteProducto as deleteProduct, getProductDetail } from "../services/product.services.js";

const handleHttp = (res, errorMessage) => {
  res.status(500).json({ error: errorMessage });
};


const getProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await getProductoById(id);
    const data = producto ? producto : "NOT_FOUND";
    res.send(data);
  } catch (error) {
    handleHttp(res, "ERROR_GET_PRODUCT");
  }
};

const getProductos = async (req, res) => { 
  try {
    const productos = await getProducts();
    res.send(productos);
  } catch (error) {
    handleHttp(res, "ERROR_GET_PRODUCTS");
  }
};

const updateProducto = async (req, res) => {
  
  try {
    const {ID_PRODUCTO } = req.params;
    const newData = req.body;
    const updatedProducto = await updateProduct(newData);
    res.send(updatedProducto);
  } catch (error) {
    res.status(500).send(`Error al actualizar el producto: ${error.message}`);
  }
};

const insertProducto = async (req, res) => {
  try {
    const productoData = req.body;
    const newProducto = await insertProduct(productoData);
    res.send(newProducto);
  } catch (error) {
    res.status(500).send(`Error al insertar el producto: ${error.message}`);
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { ID_PRODUCTO } = req.body;
    const deletedProducto = await deleteProduct(ID_PRODUCTO);
    res.send(deletedProducto);
  } catch (error) {
    res.status(500).send(`Error al eliminar el producto: ${error.message}`);
  }
};

const getProductoDetails = async (req, res) => {
  try {
    const productosDetails = await getProductDetail();
    res.send(productosDetails);
  } catch (error) {
    handleHttp(res, "ERROR_GET_PRODUCT_DETAIL");
  }
};


export { getProducto, getProductos, updateProducto, insertProducto, deleteProducto, getProductoDetails };
