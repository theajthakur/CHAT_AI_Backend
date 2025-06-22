const { Router } = require("express");
const { handleUserSearch } = require("../controllers/features");
const apiSuccessReponse = require("../utils/apiSuccessMessage");
const router = Router();

router.get("/", apiSuccessReponse);
router.post("/search/user", handleUserSearch);

module.exports = router;
