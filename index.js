const express= require("express");
const app= express();
const route = require("./router")
const user = require("./database");
const cookieparser = require("cookie-parser");


app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:false}));
app.set("view engine" , "ejs");
const port =3000;


app.use(route);
app.listen(port,()=>{
    console.log("Our server run on port no 3000");
})
