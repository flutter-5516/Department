import jwt from "jsonwebtoken";

const generateToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SEC, {
    expiresIn: "60d",
  });

  res.cookie("token", token, {
    maxAge: 60 * 24 * 60 * 60 * 1000 ,
    httpOnly: true,
    sameSite: "strict",
  });
};

export default generateToken;
