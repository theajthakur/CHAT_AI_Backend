const { Router } = require("express");
const { handleUserSearch, listAllFriends } = require("../controllers/features");
const apiSuccessReponse = require("../utils/apiSuccessMessage");
const router = Router();

router.get("/", apiSuccessReponse);
router.post("/search/user", handleUserSearch);
router.post("/friends", listAllFriends);

module.exports = router;
