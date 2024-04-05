import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";
import Producto from "./productModel.js";
import Talla from "./tallaModel.js";

const Inventario = sequelize.define(
    "inventario",
    {
      ID_INVENTARIO: {
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
          key: 'ID_PRODUCTO',
        },
      },
      ID_TALLA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Talla,
          key: 'ID_TALLA',
        },
      },
      STOCK: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  
  Producto.hasMany(Inventario, { foreignKey: "ID_PRODUCTO", as: "inventario" });
  Inventario.belongsTo(Talla, { foreignKey: "ID_TALLA", as: "talla" });

  
  export default Inventario;