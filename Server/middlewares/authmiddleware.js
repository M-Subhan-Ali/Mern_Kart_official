import jwt from "jsonwebtoken";

export const privateRoute = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "unAuthorized!" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Inavlid or expired Token" });
  }
};

// export const privateRoute = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startWith("Bearer ")) {
//       return res.status(401).json({ error: "unAuthorized!" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     req.user = decode;

//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Inavlid or expired Token" });
//   }
// };
