import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
// You must set the GOOGLE_APPLICATION_CREDENTIALS environment variable
// to the path of your Firebase Service Account JSON file.
try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK failed to initialize. Authentication will fail until credentials are provided.', error);
}

export const auth = admin.auth();
