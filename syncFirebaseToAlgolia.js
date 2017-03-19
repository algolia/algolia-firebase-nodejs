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

var algolia = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
var index = algolia.initIndex('contacts');

var contactsRef = database.ref("/contacts");

contactsRef.on('child_added', addOrUpdateIndexRecord);
contactsRef.on('child_changed', addOrUpdateIndexRecord);
contactsRef.on('child_removed', deleteIndexRecord);

function addOrUpdateIndexRecord(dataSnapshot) {
  // Get Firebase object
  var firebaseObject = dataSnapshot.val();
  // Specify Algolia's objectID using the Firebase object key
  firebaseObject.objectID = dataSnapshot.key;
  // Add or update object
  index.saveObject(firebaseObject, function(err, content) {
    if (err) {
      throw err;
    }
    console.log('Firebase<>Algolia object saved', firebaseObject.objectID);
  });
}

function deleteIndexRecord(dataSnapshot) {
  // Get Algolia's objectID from the Firebase object key
  var objectID = dataSnapshot.key;
  // Remove the object from Algolia
  index.deleteObject(objectID, function(err, content) {
    if (err) {
      throw err;
    }
    console.log('Firebase<>Algolia object deleted', objectID);
  });
}
