import transporter from "../config/mailer.config.js";

const enviarCorreo = async (correoOptions) => {
  try {
    await transporter.sendMail(correoOptions);
    console.log('Correo electrónico enviado');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
};

export default enviarCorreo;