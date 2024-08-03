const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

mongoose.connect(process.env.DB).then(()=>{
    console.log("connection succesfull");
}).catch((error)=>{
    console.log(error);
})

const schema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    confpassword:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
}]
})

schema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
}
next();
})


schema.methods.generateToken = async function(){
    try{
        const tokenuser = jwt.sign({_id:this._id.toString()},process.env.KEY);
        this.tokens = this.tokens.concat({token:tokenuser});
        await this.save();
        return tokenuser;
    }catch(error){

    }
}

const usermodel = mongoose.model("userdetail",schema);

module.exports = usermodel;
