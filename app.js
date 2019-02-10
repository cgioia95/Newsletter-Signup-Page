require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require('request');

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  var data = {
    members: [
      {
      email_address : email,
      status: "subscribed",
      merge_fields: {
        FNAME:firstName,
        LNAME: lastName
      }

    }
    ]
  };

  var jsonData = JSON.stringify(data);

  console.log(firstName, lastName, email);

  var options = {
    url: "https://"+process.env.SERVER + ".api.mailchimp.com/3.0/lists/" + process.env.LIST_ID,
    method: "POST",
    headers: {
      "Authorization": "cgoi " + process.env.API_KEY,
    },
    body: jsonData


  };

  request(options, function(error, response, body){
    if (error){
      console.log(error);
      res.sendFile(__dirname + "/failure.html");
    }

    else {
      if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
      }

      else {
        res.sendFile(__dirname + "/failure.html");
      }
    }


  })
});

app.post("/failure", function(req, res){
  res.redirect("/");
})



app.listen(process.env.PORT || 3000, function(){
  console.log("Server running on port 3000");
});
