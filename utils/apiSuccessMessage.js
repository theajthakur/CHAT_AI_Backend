const apiSuccessReponse = (req, res) => {
  return res.json({ status: "success", message: "API is working good!" });
};

module.exports = apiSuccessReponse;
