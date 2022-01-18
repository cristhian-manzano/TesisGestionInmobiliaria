// const get = (req, res) => { };
// const update = (req, res) => {};
// const destroy = (req, res) => {};

const { upload } = require("../services/awsService");

const create = (req, res) => {
  upload(req.files[0])
    .then((result) => {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });

  return res.json(req.body);
};

module.exports = {
  // get,
  create,
  // update,
  // destroy
};
