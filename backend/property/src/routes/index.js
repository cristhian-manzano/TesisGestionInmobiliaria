const router = require("express").Router();

//Routes
const propertyRoutes = require("./property");

// Assigning routes

router.use("/property", propertyRoutes);

module.exports = router;
