import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// You must set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your Firebase Service Account JSON file.
let auth: admin.auth.Auth;

try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log("Firebase credentials found. Initializing...");
      let pk = process.env.FIREBASE_PRIVATE_KEY;
      if (pk.startsWith('"') && pk.endsWith('"')) pk = pk.slice(1, -1);
      if (pk.startsWith("'") && pk.endsWith("'")) pk = pk.slice(1, -1);
      
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: pk.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase initialized successfully!");
    } else {
      console.log("Firebase vars missing. Falling back to default...");
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }
  auth = admin.auth();
} catch (error: any) {
  console.error('⚠️ Firebase Admin SDK failed to initialize:', error.message);
  auth = new Proxy({} as admin.auth.Auth, {
    get: () => {
      throw new Error(`Firebase Auth not initialized: ${error.message}`);
    }
  });
}

export { auth };
