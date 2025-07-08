const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const userModel = require('./models/user');
const { name } = require('ejs');


app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/',(req,res)=>{
    res.render("index");
})

app.post('/create', async (req,res)=>{
    let {name,email,image} = req.body;
   let createdUser =  await userModel.create({
        name,
        email,
        image
    })
    res.redirect('/read'); // It's better to redirect after a POST request
})

app.get('/read',async (req,res)=>{
    let users = await userModel.find();
    res.render("read",{users});
})


app.get('/delete/:id',async (req,res)=>{
    let users = await userModel.findOneAndDelete({_id:req.params.id});
    res.redirect("/read");
})

app.get('/edit/:userid',async (req,res)=>{
    let user = await userModel.findOne({_id:req.params.userid})
    res.render("edit",{user});
})

app.post('/update/:userid',async (req,res)=>{
    let {name,image,email}=req.body;
    // Fix: Correctly update all fields in findOneAndUpdate
    let user = await userModel.findOneAndUpdate({_id:req.params.userid}, { name, email, image }, {new:true});
    res.redirect("/read"); // Change from res.render("read") to res.redirect("/read")
})


app.listen(3000);
