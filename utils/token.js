const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: process.env.JWT_EXPIRE_IN,
      },
      (error, token) => {
        if (error) {
          console.log(error);
          reject(error);
        }

        resolve(token);
      }
    );
  });
};

module.exports = generateJWT;
