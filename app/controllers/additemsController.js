const express=require('express')
const {PrismaClient}=require('@prisma/client')
const prisma=new PrismaClient();

const addItem=async(req,res)=>
{
    try{
    const normalizeBody=Object.fromEntries(
        Object.entries(req.body).map(([key,value]) => [key.toLowerCase(),value]));
    
        console.log("normalizebody ",normalizeBody)
    const {itemname,quantity,saleprice,mrp,userid}=normalizeBody;

    if(!itemname||!quantity||!saleprice||!mrp||!userid)
    {
        console.log(itemname,quantity,saleprice,mrp,userid)
        return res.status(400).json({message:"all feilds are required "})
    }
    
    const newItem=await prisma.item.create({
        data: {itemName:itemname,quantity,salePrice:saleprice,mrp,
            user:
            {
                connect:{id :parseInt(userid)}
            }
        }
    })
    return res.status(200).json({message:"item is added successfully",NameofItem  :newItem});
    }

    catch(error)
    {
        console.log("error occurs during the addition of item ",error.message)
        return res.status(500).json({message:"failed to add an item"})
    }

}
const viewofItems=async(req,res)=>
{
    const viewItems=await prisma.item.findMany()
    res.json(viewItems)
}
module.exports={addItem,viewofItems};