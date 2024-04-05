import express from "express";
import { getProducto, getProductos, updateProducto, insertProducto, deleteProducto, getProductoDetails } from "../controller/productController.js";

const router = express.Router();


router.get("/productos", getProductos );
router.post("/productos/insert", insertProducto);

// router.get("/productos/:id", getProducto);
router.put("/productos/update", updateProducto);
router.delete("/productos/delete", deleteProducto);

router.get("/productos/detalle", getProductoDetails);

export default router;
