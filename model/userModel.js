//mongodb+srv:XavierOP:<password>@cluster0.5n21gdy.mongodb.net/?retryWrites=true&w=majority


// (schema) -> set of features and rules a certain entity should follow



const mongoose = require('mongoose')
const {Schema} = mongoose
const pass = require("./secret")

let dbLink = `mongodb+srv://XavierOP:${pass}@cluster0.5n21gdy.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(dbLink).then(function(){
    console.log("connected");
}).catch(function(err){
    console.log("error",err);
})


//Creating Schema
//Applying validation

let userSchema = new Schema({
    name:{
        type:String,
        required:[true, "Name is required!!"]
    },
    password:{
        type:String,
        required:[true, "Password is required!!"]
    },
    confirmPassword:{
        type:String,
        required:[true, "Confirm Password is required"],
        //Applying custom validation
        validate:{
            validator:function(){
                return this.password == this.confirmPassword;
            },
            //message error
            message:"Password does not match!!"
        }
    },
    email:{
        type:String,
        required:[true, "Email is required!!"],
        unique:true
    },
    phoneNumber:{
        type:String,
        minLength:[10, "Phone Number is less than 10 digit"],
        maxLength:[10, "Phone Number is more than 10 digit"]
    },
    pic:{
        type:String,
        default:"https://i.pinimg.com/736x/10/c2/c2/10c2c227f83c695cd4c08981e85a540b.jpg"
    },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Date
    },
    address:{
        type:String
    }
})

const userModel = mongoose.model('FoodAppUserMmodel',userSchema);

module.exports = userModel;