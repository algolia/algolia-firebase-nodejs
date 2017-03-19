# algolia-firebase-nodejs example

Algolia is a nice way to make your Firebase data searchable. Out of the box you get prefix matching, typo tolerance and more advanced features like faceting and filtering. This repository contains contains example code and instructions on how to run it.

## Key files

1. `importFirebaseToAlgolia.js`: Shows how to do a one-time import of all Firebase data under a specific ref.
1. `syncFirebaseToAlgolia.js`: Shows how to listen to changes of children of a ref and sync them to Algolia.
1. `loadFirebase.js`: Loads test data into Firebase so it can be sent to Algolia later.

## Prerequisites

#### Firebase

Create a [new Realtime Database](https://console.firebase.google.com), or you can use one that already exists. We'll be using the ref "contacts" for the whole example, so make sure there isn't any data there already.

#### Algolia

Create a [new Algolia application](https://www.algolia.com/manage/applications), or use one that already exists. We'll be creating an index called "contacts", so make sure that doesn't already exist.

## Usage

Clone this repository.

```
git clone git@github.com:algolia/algolia-firebase-nodejs.git
```

Install dependencies with `npm install` or `yarn`.

```
yarn
```

Create a file called `.env`. Substitute your values for the placeholders:

``` shell
ALGOLIA_APP_ID=<algolia-app-id>
ALGOLIA_API_KEY=<algolia-api-key>
FIREBASE_DATABASE_URL=https://<my-firebase-database>.firebaseio.com
```

Make sure the Algolia API key you've chosen has write access. If in doubt, use your Admin API Key.

Download a service account JSON file from Firebase. This will be used to authenticate you as an admin so you can read and write data. From the Firebase console for your database, click the gear icon and choose "Project Settings". Go to the "Service Accounts" tab. Click "Generate New Private Key". Move the downloaded file into this directory and name it `serviceAccountKey.json`.

This file and .env are in the .gitgnore, so you don't have to worry about accidentally checking them in.

#### Load example data

Load example contacts data into your Firebase database running:

```
node loadFirebase
```

Look at the code in the `loadFirebase.js` file to see what is happening. If this is successful, you will see a message "Contacts loaded to firebase" and you will be able to see data in your Firebase database in the console.

#### First-time import into Algolia

Import these contacts records into Algolia by running:

```
node importFirebaseToAlgolia
```

If this is successful, you should see "Firebase<>Algolia import done". Your contact records have been imported into Algolia and you can see them in your dashboard.

#### Ongoing sync to Algolia

In a real application, you will want to listen for Firebase changes and index them as they come in. To do this, run:

```
node syncFirebaseToAlgolia
```

This process will keep running indefinitely, listening for changes to the "contacts" node in your Firebase database. When it receives a change, it will add, update or delete the record in Algolia and then log to the console.
