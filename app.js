var express = require('express'); //requiring express to handle the routing
var app = express();
var bodyParser = require('body-parser'); //requiring body parser for the post requests
var router = express.Router();

app.use('/', router); //The router will use the home directory
var admin = require("firebase-admin");
var FieldValue = require('firebase-admin').firestore.FieldValue;

//initializing firebase admin with the database credentials
var serviceAccount = {
  "type": "service_account",
  "project_id": "final-project-240516",
  "private_key_id": "9e98b018c5de25d7ce8fc638b500eb52d17cc094",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCpSWFAYbGSx6Kr\nJnAMWlAEqRQc82PEmaUh6+EARLJ4pk1j6URc3zxAkkZFUGQIBk5if8e4qADVc3HF\nUeX3oatRAzFsX7kcN0WH1ZT4SHlnbiHfBhOp/NFzwFi7g0fxgeD7jTYDjJo/ZReS\nWexyqug2PseL1DoJNLojfRSklRmQy/2Ip6SOtudsNyHp2O4iVX2aSJEVS5C9eGsN\nWYtld7/9kj7yXccF/JZ0ewPTV4hYEDuqv3eAiSkCXd/n0UKCpGc41eMs93juKf5A\nhY0Orp642bgJag/0Zmh3abACCPOEQHFG3+xTtYEbPy1EKfB3tYSRiKKm8x+Z5ITK\n8BRRU3d3AgMBAAECggEAAfNXiyz5Kv5mvv3tK+PJo1/vXG/GXdFgb85nn+VXQ4kk\nOnFwafOeyvocJStxWjswBcPqG6TWs+Gzx0gsuwkxfxmkZ8udsTED7oQMA7izcvke\nwb9GyVXvXaGMLIl1qbXZORfqkjFKHKfXoB9gFY9fF1RlVLul+Uf2xXE2/WpPQiU5\nuCW+5VXZo1/koppPrf8OeS4gKJo7UoW+iyXK12DP13O6UFPXmt6+I/TOZrGPW5au\nuQe5eY7fESViVqy9eDrUFgntr2CogwhfBR1RwQ7clRzGV6RuXUak3slWJ+4SpFG5\nLlFioAdjrBWnazRZROHQilQ2U5w7DMKGsvGM2qLdgQKBgQDedJombTFsmL0Pcf4l\nS95pZpJmbhSXBmqxekOEzl8ymKq8QJin2kjKrJ+FMGIjdIF3hRXMAIwL+hV/2GWp\nQc6HPpuxYcNIm5zArNVg2VutkOdtHrdO5Jx9o+7gi3YdrCG8eF0qNy9yc4rzCZnl\nS8ORkdyvaJDBNSlXG3gI7epMSQKBgQDC0FA0cu096z+zDUKaoKa8RdhDQfAw8Jb5\nTTlB6zrlJ1H7PzBzNgy3pSJFjpJp+5HfuCvyDUFLQBT1+RemqXIRceEzeTkPlkqC\ntC1ucE9hApP3WTDG2bw3/XoUBA58H4NuKOjKmAImPXth6XR3l7zvPFI6aI6wPxyV\n1uMQko4lvwKBgAWapGOBbrRQqLqh4YgpACJhniCMd2JSnA96iAbpeAZ7SBnT+sSH\nwDuy25XsYRyJi9Vp+eGYxe5rT21YEz+PU9eeYSe30cabfPhxojJ9Z0zZEKt0EaQg\nKD0WCyeG++PFeVgZJCezGjPk60QyIrlfDj81kHyuwq7LWw5Bt+VpsPRZAoGBAINR\nyo7gXZ2cg27d5GS5IEvPRQ1pWFCVDR/19z/BIg0wKSoUmUNATuhID0cV6Qo6A0Xs\nLutWFgp0oux/wXqdw/+QZT6+W0FvjMB4VhuY51k8VKOqYp/YS/DuE6mEZoMy9vR9\n7RYLy38deJsytEidZ0VYwxEORAj4MfurQ5p7QAifAoGALBUY+Djcp+x/f0W9KjpP\n0UW65GigdqBxmd7l+2GgyCEJ7KsQccvoJqLvoPYN61TVdTDkgHI0xrumkmKCTBkT\nvzt/GcWLEFEDm/IU3whRDfQS4+H/04uy0KOgTm3GekBLoWBX/yW+h0dHr+KcFNhd\nJNZbNIHtb/6za5ImRYcZAmM=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-v3zmi@final-project-240516.iam.gserviceaccount.com",
  "client_id": "114705703866907388819",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-v3zmi%40final-project-240516.iam.gserviceaccount.com"
};

//initializing the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://final-project-240516.firebaseio.com"
});

//calling the api
var db = admin.firestore();

//getting the Events collection
var collection = db.collection('Events');



//Getting the default page and writing html to the page
//This page will list all the events in the database
router.get('/', function ServerGetRootRequest(request, response) {

  //this async call gets the data from the database as documented in the Firestore api
  collection.get()
    .then(snapshot => {
      response.write(`<!DOCTYPE HTML>
      <html>
      <head>
      <meta name="author" content="Akshy Palanisamy">
      <script async src='http://localhost:3000/app.js' > </script>
      <title>HomePage</title>
      <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body>
      <div class="container" style="text-align: center">
      <h1>Events</h1>`);

      //For each doc in the collection I create a dynamic link to that page
      snapshot.forEach(doc => {
        console.log(doc.id);
        response.write('<h2><a href="http://localhost:3000/'+doc.id+'">'+doc.id+"</a></h2>");
      });
      response.write("</div></body></html>");
      response.end();
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
});



//Depending on what event the user clicks on the homepage they get routed to a table view of the events and members
router.get('/:eventID', function ServerGetRootRequest(request, response) {
    var eventid = request.params.eventID; //storing the eventid so that it can be sent along with the dropdown form below
    collection.doc(request.params.eventID).get().then(doc => { //getting the document requested and parsing that in an html format in the response
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
        var docObj = JSON.parse(JSON.stringify(doc.data()));  //parsing the document fields into a JSON object in order to use it within the html
        response.write(`<!DOCTYPE HTML>
        <html'>
        <head>
        <meta name="author" content="Akshy Palanisamy">
        <script async src='http://localhost:3000/app.js' > </script>
        <title>Table</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>

        <table class = 'table table-bordered table-hover'><thead class='thead-dark'>
        <tr>
        <th>Memebers</th>
        <th>Signed Up Item</th>
        <th>Duration</th>
        </tr></thead><tbody>`);

        const keys =  Object.keys(docObj.Members); //getting the keys within the document to display the names in the drop down box form
        var names = []; //array to hold the names
        for(members of keys){
          names.push(members);//iterating through and adding the names
            response.write(
              `<tr>
              <td>`+ members + `</td><td>` + docObj.Members[members].item + "</td><td>" + docObj.Members[members].Duration + "</td></tr>"
            );
          }

        response.write("</tbody></table>");
        response.write(`<table class = 'table table-bordered table-hover'><thead class='thead-dark'>
                <tr>
                <th>Items</th>
                <th>Signed Up?</th>
                <th>Name</th>
                </tr></thead><tbody>`);
                const keysI =  Object.keys(docObj.Items);//getting all the keys in the item to iterate through and display their values
                for(items of keysI){
                  //drawing teh table
                    response.write(
                      `<tr>
                      <td>`+ items + `</td><td>` + docObj.Items[items].SignedUp + `</td><td>`+docObj.Items[items].Name+`<form method="POST" action="/" ><name="eventid" value="`+eventid+`"><name="itemEvent"  value="`+items+`"><select name="nameMember" >`
                    );

                  //iterating therough all the names in the array to show them in the drop down box
                  for(nameL of names){
                    //the form will submit the name, the eventid and the item name
                    response.write(`<option  value="`+[nameL,items,eventid]+'">'+nameL+`</option>`);
                  }
                  //adding another drop down option for the event that no user signs up
                  response.write(`<option value="`+["None",items,eventid]+`" selected>None</option>`)
                      response.write( "</select><input type='submit' name='submit' value='submit' /></form></td></tr>");
                  }

        response.write("</tbody></table>");


        response.write("</body></html>");

        response.end();
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

    // Create a static page with links to all 5 requests, or serve that page here
});

//The router will use the body parser for the put request
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


//This is the post request that is sent when the user signs up for an item
router.post('/', function ServerPostRootRequest(request, response) {
var nameM = request.body.nameMember; //getting the value from the post and splitting to get the name, eventid and item
var nameArr = nameM.split(',');
var nameOfPerson = nameArr[0];
var itemOfEvent = nameArr[1];
var nameOfEvent = nameArr[2];

var docOfEvent = collection.doc(nameOfEvent); //getting the document of the event id

//checking if none was picked on the dropdon list
if(nameOfPerson.localeCompare("None") != 0){

var updateMem = docOfEvent.update({['Members.'+nameOfPerson+'.item']:itemOfEvent}); //update the member's table on information about what they are bringing
var updateItembool = docOfEvent.update({['Items.'+itemOfEvent+'.SignedUp']:true}); //update the item table with the fact that someone is bringing it
var updateItem = docOfEvent.update({['Items.'+itemOfEvent+'.Name']:nameOfPerson}); //update the item table with the name of the person bringing the item


}else{
  //if the user chooses none then the item on that row will set to false and the name to none
  var updateItembool = docOfEvent.update({['Items.'+itemOfEvent+'.SignedUp']:false});
  var updateItem = docOfEvent.update({['Items.'+itemOfEvent+'.Name']:"None"});
}

response.redirect(request.get('referer')); //refreshing the page when done posting

});


//initializing the server on port 3000
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Listening at http://%s:%s", host, port)
});
