// get ,post,getByIds
const express = require("express")
const router = express.Router()
const storeRoute = require("../controllers/store.controller")
const { authController } = require("../controllers/auth.controller")


router.route("/seller/:email").get(storeRoute.getStoreByEmail);

router
  .route("/:id")
  .get(storeRoute.getStoreById)
  .patch(storeRoute.updateStore)
  .delete(storeRoute.deleteStore)
  .post(storeRoute.addStore);

router.route("/").get(storeRoute.getAllStore);
router.route("/").get(storeRoute.manageAllStore);



module.exports = router;
