require("dotenv").config();
const app = require("./app");
const { db } = require("./database/config");
const initModel = require("./models/initModels");

//LA AUTENTICACIÓN CON LA BASE DE DATOS
db.authenticate()
  .then(() => console.log("Database Authenticated! 😼"))
  .catch((error) => console.log(error));

//RELACIONES
initModel();

//LA SINCRONIZACIÓN CON LA BASE DE DATOS
db.sync()
  .then(() => console.log("Database Synced! 😸"))
  .catch((error) => console.log(error));

const port = +process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
