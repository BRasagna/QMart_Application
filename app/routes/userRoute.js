const express=require('express')
const router=express.Router();
const {register,login,superadmin}=require('../controllers/userController')

const verifySuperAdmin=require('../middlewares/authMiddleware')

router.post('/register',register)
router.post('/login',login)
router.post('/superadmin',superadmin)
router.post('/authorized',verifySuperAdmin,(req,res)=>
    {
        return res.status(200).json({message:"authorization route",email:req.user.email})
    })


module.exports=router;
