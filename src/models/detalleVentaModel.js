import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Producto from "./productModel.js";
import Venta from "./ventaModel.js"
import Inventario from "./inventarioModel.js";

const DetalleVenta = sequelize.define(
  "detalleVenta",
  {
    ID_DETALLE_VENTA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ID_PRODUCTO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Producto,
        key: "ID_PRODUCTO",
      },
    },
    ID_VENTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Venta,
        key: "ID_VENTA",
      },
    },
    ID_TALLA: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Inventario,
        key: "ID_TALLA",
      },
    },
    CANTIDAD: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PRECIO: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {}
);

DetalleVenta.belongsTo(Producto, { foreignKey: "ID_PRODUCTO", as: "producto" });
DetalleVenta.belongsTo(Venta, { foreignKey: "ID_VENTA", as: "venta" });
DetalleVenta.belongsTo(Inventario, {foreignKey: "ID_TALLA", as: "talla" });

export default DetalleVenta;
