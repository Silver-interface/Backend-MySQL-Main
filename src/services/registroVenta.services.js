import Venta from "../models/ventaModel.js";
import enviarCorreo from "./mailer.services.js";

const enviarCorreoElectronico = async (ventaData, newVenta) => {
  try {

    const tablaHTML = ventaData.cart.map(item => `
      <tr>
        <td>${item.ID_PRODUCTO}</td>
        <td><img src="${item.IMAGEN}" alt="Imagen del producto" style="max-width: 80px;"></td>
        <td>${item.NOMBRE_PRODUCTO}</td>
        <td>${item.TALLA}</td>
        <td>${item.CANTIDAD}</td>
        <td>$ ${item.PRECIO} COP</td>
      </tr>
  `).join('');
   
    const total = calcularTotal(ventaData.cart);
    const emailContent = `
  <body style = "font-family: Arial, sans-serif; border: 1px solid black; width: 120vh; padding: 15px;">
    <h1>Agradecemos tu confianza</h1>
  
    <div style="background-color: #F6A444; padding: 10px; color:white;">
      <div style="float: left;">
        <h3 style="margin: 1;">Resumen de compra</h3>
      </div>
      <div style="float: right;">
        <p style="margin-top: 2;"><strong>Número de factura:</strong> ${newVenta.ID_VENTA}</p>
      </div>
      <div style="clear: both;"></div>
    </div>
  
    <div style="padding: 7px;"></div>
    <h2>Cliente</h2>
    <p><strong>Nombre:</strong> ${ventaData.name} ${ventaData.lastName}</p>
    <p><strong>Email:</strong> ${ventaData.email}</p>
    <p><strong>Dirección: </strong> ${ventaData.address}</p>
    <p><strong>Tipo de ID: </strong> ${ventaData.IdType}</p>
    <p><strong>Numero ID: </strong> ${ventaData.IdNumber}</p>
    <p><strong>Número de teléfono: </strong> ${ventaData.phoneNumber}</p>
  
    <p><h2>Carrito de compras</h2></p>
    
    <table border="1" cellspacing="0" cellpadding="5" style="width: 100%; text-align: center;">
    <thead>
        <tr>
          <th>REF PRODUCTO</th>
          <th>IMAGEN</th>
          <th>NOMBRE</th>
          <th>TALLA</th>
          <th>CANTIDAD</th>
          <th>PRECIO</th>
        </tr>
      </thead>
      <tbody>
      ${tablaHTML}
      </tbody>
    </table>
    
    <p style="font-weight: bold; float: right"><strong>Total: </strong>$ ${total} COP</p>
    <div style="clear: both;"></div>

  <div style="background-color: orange; padding: 10px; color: white;">
    <div style="float: left;">
    <strong style="font-size: 25px;">GeneralShop</strong>
    </div>
    <div style="float: right;">
      <p><strong style="margin: 0; font-size: 20px;">Gracias por tu compra</strong></p>
      <p style="margin: 0; font-size: 15px; text-align: center;"> Created by: Silver Interface</p>
    </div>
    <div style="clear: both;"></div>
  </div>
  </body>
  `;

    const correoOptions = {
      from: process.env.EMAIL_FROM,
      to: ventaData.email,
      subject: 'Confirmacion de compra',
      html: emailContent
    };

    await enviarCorreo(correoOptions);

    console.log("Correo electrónico enviado correctamente");
  } catch (error) {
    throw new Error(`Error al enviar el correo electrónico: ${error.message} `);
  }
};



const calcularFechaEntrega = (fechaActual) => {
  const fechaEntrega = new Date(fechaActual);
  fechaEntrega.setDate(fechaEntrega.getDate() + 3);
  return fechaEntrega;
};

const calcularTotal = (cart) => {
  let total = 0;
  for (const item of cart) {
    total += item.PRECIO * item.CANTIDAD;
  }
  return total;
};

const insertVenta = async (ventaData) => {
  try {
    const ventaPrincipalData = {
      ID_USUARIO: ventaData.ID_USUARIO,
      FECHA_VENTA: new Date(),
      TOTAL: calcularTotal(ventaData.cart),
      FECHA_ENTREGA: calcularFechaEntrega(new Date()),
    };
    const newVenta = await Venta.create(ventaPrincipalData);
    await enviarCorreoElectronico(ventaData, newVenta);

    return newVenta;
  } catch (error) {
    throw new Error(`Error al insertar la venta: ${error.message} `);
  }
};

const getVentas = async () => {
  try {
    const ventas = await Venta.findAll();
    return ventas;
  } catch (error) {
    throw new Error(`Error al obtener las ventas: ${error.message} `);
  }
};

const getVentaById = async (id) => {
  try {
    const venta = await Venta.findByPk(id);
    if (!venta) {
      throw new Error("Venta no encontrada");
    }
    return venta;
  } catch (error) {
    throw new Error(`Error al obtener la venta: ${error.message} `);
  }
};

const updateVenta = async (id, newData) => {
  try {
    const venta = await Venta.findByPk(id);
    if (!venta) {
      throw new Error("Venta no encontrada");
    }
    await venta.update(newData);
    return venta;
  } catch (error) {
    throw new Error(`Error al actualizar la venta: ${error.message} `);
  }
};

const deleteVenta = async (id) => {
  try {
    const venta = await Venta.findByPk(id);
    if (!venta) {
      throw new Error("Venta no encontrada");
    }
    await venta.destroy();
    return venta;
  } catch (error) {
    throw new Error(`Error al eliminar la venta: ${error.message} `);
  }
};

export { insertVenta, getVentas, getVentaById, updateVenta, deleteVenta };
