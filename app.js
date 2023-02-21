//jshint esversion:6
//here we are sending the data to mailchimp using post request
const express=require("express");
const https=require("https");
var http=require("http");
const request=require("request");
const bodyParser=require("body-parser");
const app=express();

app.use(express.static("public"));//specifies a static folder
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
  });


app.post("/",function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;
    

   const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                 merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName
        }
           
             }
        ]
    };

    var jsonData=JSON.stringify(data);
    const url="https://us17.api.mailchimp.com/3.0/lists/6b5e5977f4";//sending to mailchimp using its specified url

   
    options={
      method:"POST",
      auth:"Bhagyashree:3a85f5afc324f7be2e3862119ba77a43-us17"
    }
    const request=https.request(url,options,function(response){//request from bhagya's friends --basic authentication

        const statusCode=response.statusCode;
        if(statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

       response.on("data",function(data){// mailchimp authenticates first that it has received the data.
        console.log(JSON.parse(data));
        
       });
    });

    request.write(jsonData);//finally storing the data
    request.end();

});

app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000");
});

//3a85f5afc324f7be2e3862119ba77a43-us17-api key
//---list---6b5e5977f4---to identify the list where u wanna put ur subscribers into
