const express=require('express')
const router=express.Router();
const {addItem,viewofItems}=require('../controllers/additemsController')
router.post('/additem',addItem)
router.get('/view',viewofItems)
module.exports=router;

