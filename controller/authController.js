const jwt = require("jsonwebtoken")
const secretkey = "kenkaneki"
const userModel = require("../model/userModel");

const mailSender = require("../utilities/mailSender")


async function signupController(req,res){
    try{
        let data = req.body;
        console.log(data);
        let newUser =await userModel.create(data);
        console.log(newUser);
        res.json({
            result:"Data received",
        })}
        catch(err){
            res.status(500).json({
                result:err.message
            })
        }
}


async function loginController(req,res){
    try{
        let data = req.body;
        //console.log(data);
        let {email,password} = data;
        if(email && password){
            let user =await userModel.findOne({email:email});
            
            if(user){
                if(user.password == password){
                    //created jwt
                    const token = jwt.sign({data : user['_id']}, secretkey);
                    console.log(token);
                    res.cookie("JWT",token);
                    console.log(user);
                    res.status(200).json({user})
                }else{
                    res.status(400).json({result:"Credential does not match"})
                }
            }else{
                res.status(404).json({result:"User does not exist !! Kindly signup"})
            }
        }else{
            res.status(400).json({result:"Kindly enter your credentials!!"})
        }

    }catch(err){
        console.log("abc",err.message);
        res.status(500).json({
            result:err.message
        })
    }
}

async function forgetPasswordController(req,res){
    try{
        let {email} = req.body;
        
        let otp = otpGenerator();
        let user = await userModel.findOne({email});
        if(user){
            let otp = otpGenerator();
            let afterFiveMin = Date.now() + 1000*60*5;
            await mailSender(email,otp);
            user.otp = otp;
            user.otpExpiry = afterFiveMin;
            await user.save();
            res.json({
                data:user,
                "message":"OTP sent to your mail"
            })
        }else{
            res.json({
                result:"User with this email does not exist! Kindly Signup!!!"
            })
        }
    }catch(err){
        res.send(err.message);
    }
}

async function resetPasswordController(req,res){
    try{
        let{otp,password,confirmPassword,email} = req.body;
        let user = await userModel.findOne({email});
        let currentTime = Date.now();
        if(currentTime > user.otpExpiry){
            delete user.otp;
            delete user.otpExpiry;
            await user.save();
            res.json({
                message:"OTP Expired!!"
            })
        }else{
            if(user.otp != otp){
                res.json({
                    message:"OTP does not match"
                })
            }else{
                user = await userModel.findOneAndUpdate({otp},{password,confirmPassword},{runValidators:true,new:true});
                delete user.otp;
                delete user.otpExpiry;
                await user.save();

                res.json({
                    user:user,
                    message:"Password has been reset"
                })
            }
        }

    }catch(err){
        res.send(err.message);
    }
}

function otpGenerator(){
    return Math.floor(Math.random()*1000000)
}

function protectRoute(req,res,next){
    try{
        let cookies = req.cookies;
        let JWT = cookies.JWT;
        if(cookies.JWT){
            const token = jwt.verify(JWT, secretkey);
            console.log(token);
            let userId = token.data;
            req.userId = userId;
            next();
        }else{
            req.send("You are not logged in !!")
        }
    }catch(err){
        console.log(err);
        req.send(err.message)
    }
    
}


module.exports = {
    signupController,
    loginController,
    resetPasswordController,
    forgetPasswordController,
    protectRoute
}