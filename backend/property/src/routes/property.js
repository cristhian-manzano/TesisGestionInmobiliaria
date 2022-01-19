const routes = require("express").Router();

const {
  getAll,
  get,
  create,
  update,
  destroy,
} = require("../controllers/property");

// Multer, files
const { multerMiddleware } = require("../middlewares/multerMiddleware");

const { validateToken } = require("../middlewares/AuthMiddleare");

// Global Validate token
// routes.use(validateToken);

// Routes
routes.get("/", getAll);
routes.get("/:id", get);
routes.post("/", validateToken, multerMiddleware, create);
routes.put("/:id", validateToken, multerMiddleware, update);
routes.delete("/:id", validateToken, destroy);

module.exports = routes;
