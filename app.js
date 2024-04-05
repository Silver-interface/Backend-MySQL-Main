import express from "express";
import cors from "cors";
import jsonParserMiddleware from "./src/middlewares/jsonParserMiddleware.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRotues from "./src/routes/productRoutes.js";
import sequelize from "./src/config/sequelize.js";
import registroDetalleVentaRoutes from "./src/routes/registroDetalleVentaRoutes.js";
import registroVentaRoutes from "./src/routes/registroVentaRoutes.js";


const app = express();
const corsOptions = {
  origin: 'http://localhost:3000',
  allowedHeaders: ['Authorization', 'Content-Type'], // Agrega 'Authorization' a los encabezados permitidos
};

app.use(cors());
app.use(express.json());
app.use(jsonParserMiddleware);
app.use(express.static('public'));
app.use(authRoutes);
app.use(productRotues);
app.use(registroDetalleVentaRoutes);
app.use(registroVentaRoutes);

sequelize.options.logging = false;

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port => ${port}`);
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Base de datos y modelos sincronizados");
  })
  .catch((error) => {
    console.error("Error sincronizando modelos:", error);
  });


