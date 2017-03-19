var dotenv = require('dotenv');
var firebaseAdmin = require("firebase-admin");
var algoliasearch = require('algoliasearch');

// load values from the .env file in this directory into process.env
dotenv.load();

var serviceAccount = require("./serviceAccountKey.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});
var database = firebaseAdmin.database();

// listening is all configured, let's add some contacts
Promise.all([
  database.ref('/contacts/josh').set({
    name: 'Josh',
    city: 'San Francisco'
  }),
  database.ref('/contacts/tim').set({
    name: 'Tim',
    city: 'Paris'
  })]).then(function() {
    console.log("Contacts loaded to firebase");
    process.exit(0);
  }).catch((function(error) {
    console.error("Error loading firebase", error);
    process.exit(-1);
  }));
