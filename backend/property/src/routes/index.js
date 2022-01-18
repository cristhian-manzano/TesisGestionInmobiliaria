const router = require("express").Router();

//Routes
const propertyRoutes = require("./property");
const sectorRoutes = require("./sector");
const typePropertyRoutes = require("./typeProperty");

// Assigning routes

router.use("/property", propertyRoutes);
router.use("/sector", sectorRoutes);
router.use("/type-property", typePropertyRoutes);

module.exports = router;
