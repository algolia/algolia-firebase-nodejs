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
contactsRef.once('value', initialImport);
function initialImport(dataSnapshot) {
  // Array of data to index
  var objectsToIndex = [];
  // Get all objects
  var values = dataSnapshot.val();
  // Process each child Firebase object
  dataSnapshot.forEach((function(childSnapshot) {
    // get the key and data from the snapshot
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    // Specify Algolia's objectID using the Firebase object key
    childData.objectID = childKey;
    // Add object for indexing
    objectsToIndex.push(childData);
  }))
  // Add or update new objects
  index.saveObjects(objectsToIndex, function(err, content) {
    if (err) {
      throw err;
    }
    console.log('Firebase<>Algolia import done');
    process.exit(0);
  });
}
