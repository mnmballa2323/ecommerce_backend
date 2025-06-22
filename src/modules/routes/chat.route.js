const express = require("express")
const chatRoute = require("../controllers/chat.controller")
const router = express.Router()


router.route('/').post(chatRoute.createChat)
router.route('/:userEmail').get(chatRoute.userChats)
router.route('/:id').delete(chatRoute.deleteChat)
router.route('/find/:firstEmail/:secondEmail').get(chatRoute.findChat)

router.route('/blockUser/:chatId/:email').post(chatRoute.blockUser)
router.route('/unblockUser/:chatId/:email').post(chatRoute.unblockUser)

module.exports = router;