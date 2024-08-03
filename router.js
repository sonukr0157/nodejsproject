const express= require("express");
const Router = express.Router();
const user = require("./database");
const bcrypt = require("bcryptjs");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("./authorization");


Router.get("/",(req,res)=>{
    res.render("index");
})

Router.get("/login_direct",(req,res)=>{
    res.render("login");
   // res.send(`JWT: ${req.cookies.jwt}`);
})

Router.get("/auth",auth,(req,res)=>{
    res.render("auth");
})


Router.post("/register",async(req,res)=>{
    try{
        const data = new user(req.body);
        if(data.password==data.confpassword){
        const emailvalidation = await user.findOne({email:data.email})
        if(emailvalidation){
            res.send("This email already exist.... Please Sing up again");
        }

        const token = await data.generateToken();
        console.log("This is a user token "+ token);
        res.cookie("jwt",token);

        const savedata = await data.save();
        res.render("login");
        }else{
            res.status(400).send("Invalid password");
        }
    }catch(error){
        res.status(400).send(error);
    }
})


Router.post("/login",async(req,res)=>{
    try{
        const userpassword = req.body.password;
        const checkemail = req.body.email;
        const databasedata =  await user.findOne({email:checkemail});

        const ismatch = await bcrypt.compare(userpassword,databasedata.password);

        if(ismatch){
        const token = await databasedata.generateToken();
        res.cookie("jwt",token);
        res.render("contact");
        }else{
            res.status(400).send("Invalid password"); 
        }
    }catch(error){
        res.status(400).send(error); 
    }
})

Router.get("/logout",auth,async(req,res)=>{
    try{
        req.user.token = [];
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login");
    }catch(error){
        res.status(500).send(error);
    }
})


module.exports = Router;