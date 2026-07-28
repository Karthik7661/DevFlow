import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let auth: Auth;

try {
  const apps = typeof getApps === 'function' ? getApps() : [];
  if (!apps.length) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      console.log("Firebase credentials found. Initializing...");
      let pk = process.env.FIREBASE_PRIVATE_KEY;
      if (pk.startsWith('"') && pk.endsWith('"')) pk = pk.slice(1, -1);
      if (pk.startsWith("'") && pk.endsWith("'")) pk = pk.slice(1, -1);
      
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: pk.replace(/\\n/g, '\n'),
        }),
      });
      console.log("Firebase initialized successfully!");
    } else {
      console.log("Firebase vars missing. Falling back to default...");
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'devflow-ca713',
      });
    }
  }
  auth = getAuth();
} catch (error: any) {
  console.error('⚠️ Firebase Admin SDK failed to initialize:', error.message);
  auth = new Proxy({} as Auth, {
    get: () => {
      throw new Error(`Firebase Auth not initialized: ${error.message}`);
    }
  });
}

export { auth };
