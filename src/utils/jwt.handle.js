import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "token.01010101";

const generateToken = (userData) => {
  const token = jwt.sign({userData}, JWT_SECRET, {
    expiresIn: "2h",
  });
  return token;
};

const verifyToken = (token) => {
  console.log("jwt que llega ", token);
  const isOk = jwt.verify(token, JWT_SECRET);
  return isOk;
};

export { generateToken, verifyToken };