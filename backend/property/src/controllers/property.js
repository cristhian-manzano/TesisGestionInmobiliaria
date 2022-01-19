const { uploadFiles, deleteFiles } = require("../services/awsService");
const {
  validateCreateProperty,
  validateUpdateProperty,
} = require("../validations/property");
const Property = require("../models/property");
const ImagesProperty = require("../models/imageProperty");
const sequelize = require("../models");

const getAll = async (req, res) => {
  try {
    const properties = await Property.findAll({
      include: {
        model: ImagesProperty,
        as: "ImagesProperties",
        attributes: {
          exclude: ["idProperty"],
        },
      },
    });

    return res.json({ data: properties });
  } catch (error) {
    console.log("ERROR MESSAGE; ", error.message);
    return res.send("error");
  }
};

const get = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findByPk(id, {
      include: {
        model: ImagesProperty,
        as: "ImagesProperties",
        attributes: {
          exclude: ["idProperty"],
        },
      },
    });

    if (!property) return res.json({ message: `Property ${id} not found` });

    return res.json({ updated: property });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const create = async (req, res) => {
  const { error, value } = validateCreateProperty(req.body);
  if (error) return res.json({ message: error.message });

  try {
    const result = await sequelize.transaction(async (t) => {
      value.idOwner = +req.user?.id;
      const createdProperty = await Property.create(value, { transaction: t });
      const imagesUploaded = (await uploadFiles(req.files)) || [];

      if (imagesUploaded.length > 0) {
        await Promise.all(
          imagesUploaded.map(async (image) => {
            await ImagesProperty.create(
              {
                url: image.Location,
                key: image.Key || image.key,
                idProperty: createdProperty.id,
              },
              { transaction: t }
            );
          })
        );
      }

      return createdProperty;
    });

    return res.json({ created: result });
  } catch (e) {
    console.log("Error: ", e.message);
    res.json({ error: e.message });
  }
};

const update = async (req, res) => {
  const { error, value } = validateUpdateProperty(req.body);
  if (error) return res.json({ message: error.message });

  try {
    const id = req.params.id;
    const property = await Property.findByPk(id);
    if (!property) return res.json({ message: `Property ${id} not found` });

    const result = await sequelize.transaction(async (t) => {
      if (value.deletedImages?.length) {
        // Delete images from aws S3
        await deleteFiles(deletedImages);
        // Delete images from database
        await Promise.all(
          value.deletedImages.map(async (image) => {
            await ImagesProperty.destroy({
              where: { id: image.id },
              transaction: t,
            });
          })
        );
      }

      const imagesUploaded = (await uploadFiles(req.files)) || [];

      if (imagesUploaded.length > 0) {
        await Promise.all(
          imagesUploaded.map(async (image) => {
            await ImagesProperty.create(
              {
                url: image.Location,
                key: image.Key || image.key,
                idProperty: property.id,
              },
              { transaction: t }
            );
          })
        );
      }
      // Update Property
      return property.update(value, { transaction: t });
    });

    return res.json({ updated: result });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.params.id;
    const property = await Property.findByPk(id, {
      include: {
        model: ImagesProperty,
        as: "ImagesProperties",
        attributes: {
          exclude: ["idProperty"],
        },
      },
    });

    if (!property) return res.json({ message: `Property ${id} not found` });

    if (property.ImagesProperties?.length)
      await deleteFiles(property.ImagesProperties);

    await property.destroy();

    return res.json({ updated: property });
  } catch (error) {
    return res.json({ error: error.message });
  }
};

module.exports = {
  getAll,
  get,
  create,
  update,
  destroy,
};
