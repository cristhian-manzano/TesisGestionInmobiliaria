const routes = require("express").Router();
const { create, get, update, destroy } = require("../controllers/property");

const { validateToken } = require("../middlewares/AuthMiddleare");
// Multer, files
const { multerMiddleware } = require("../middlewares/multerMiddleware");

// X-user
routes.use(validateToken);

// Routes
routes.post("/", multerMiddleware, create);
routes.get("/", get);

// routes.put("/:id", update);
// routes.delete("/:id", destroy);

module.exports = routes;
