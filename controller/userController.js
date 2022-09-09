const userModel = require("../model/userModel")



async function profileController(req,res){
    try{
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.json({
            user:user,
            message:"data of logged in user is send"
        })
    }catch(err){
        res.send(err.message);
    }
    
}

async function getAllUsersController(req,res){
    try{
        let users = await userModel.find();
        res.json(users);
    }catch(err){
        req.send(err.message);
    }
    //console.log(req.cookies);
    //res.send("cookie read");
}


module.exports = {
    profileController:profileController,
    getAllUsersController:getAllUsersController
}