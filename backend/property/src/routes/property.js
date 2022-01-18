const routes = require("express").Router();
const { create, get, update, destroy } = require("../controllers/property");

// Multer
const { multerMiddleware } = require("../middlewares/multerMiddleware");

// Routes
routes.post("/", multerMiddleware, create);
routes.get("/", get);

// routes.put("/:id", update);
// routes.delete("/:id", destroy);

module.exports = routes;
