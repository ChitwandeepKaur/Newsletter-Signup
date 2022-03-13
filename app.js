const express = require('express');
const path = require('path');
const app = express();
const https = require('https');
const req = require('express/lib/request');
const { json } = require('express/lib/response');
const res = require('express/lib/response');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended: true}));

//PASTE YOUR API KEY HERE
const API_key = "";
//THE LAST TWO DIGITS OF YOUR API KEY, FOR EXAMPLE, us-15, so put 15 below
const last_two_digits ="";
//LIST ID FROM MAILCHIMP
const list_id = "";
app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.post("/",function(req,res){
    const firstname = req.body.fName;
    const lastname = req.body.lName;
    const email = req.body.email;
   

    let data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME : firstname,
                    LNAME : lastname
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = `https://us${last_two_digits}.api.mailchimp.com/3.0/lists/${list_id}`;
    const options = {
        method : "POST",
        auth : `chitwan:${API_key}`
    }

const request = https.request(url,options,function(response){

    if(response.statusCode===200){
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
        console.log(JSON.parse(data));
    })
})

request.write(jsonData);
request.end();
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server listening at port 3000");
})
