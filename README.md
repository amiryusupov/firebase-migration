# Firebase Migration

This repo is for migrating given Json information to the specific Firestore collection.

## Usage
Install necessary npm packages through terminal
```console
npm install
```

---

Then, create a new json file with your firebase service account credentials.

Here's what it looks like:

```js
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project-id.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}
```

#### To get this file:

1. Go to Firebase Console (https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings (gear icon)
4. Go to Service Accounts tab
5. Click "Generate New Private Key"
6. Save the downloaded JSON file securely

Next, write the path of your json file to the space written ```"./yourFirebaseServiceAccount.json"``` in migration.js

---

In the end of the `migration.js` file, there is a place called `"./yourJsonData.json"` which you have to write the path of your json file which you want to migrate.

Near this, there is a place called `"collectionName"` which you have to write the name of your collection which you want to migrate to.

After filling all these stuff, write this to your terminal

```console
node migration.js
```

So, congratulations you have successfully migrated your raw Json information to the Firestore collection
