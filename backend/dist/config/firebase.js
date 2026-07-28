"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
let auth;
try {
    const apps = typeof app_1.getApps === 'function' ? (0, app_1.getApps)() : [];
    if (!apps.length) {
        if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            console.log("Firebase credentials found. Initializing...");
            let pk = process.env.FIREBASE_PRIVATE_KEY;
            if (pk.startsWith('"') && pk.endsWith('"'))
                pk = pk.slice(1, -1);
            if (pk.startsWith("'") && pk.endsWith("'"))
                pk = pk.slice(1, -1);
            (0, app_1.initializeApp)({
                credential: (0, app_1.cert)({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: pk.replace(/\\n/g, '\n'),
                }),
            });
            console.log("Firebase initialized successfully!");
        }
        else {
            console.log("Firebase vars missing. Falling back to default...");
            (0, app_1.initializeApp)({
                projectId: process.env.FIREBASE_PROJECT_ID || 'devflow-ca713',
            });
        }
    }
    exports.auth = auth = (0, auth_1.getAuth)();
}
catch (error) {
    console.error('⚠️ Firebase Admin SDK failed to initialize:', error.message);
    exports.auth = auth = new Proxy({}, {
        get: () => {
            throw new Error(`Firebase Auth not initialized: ${error.message}`);
        }
    });
}
//# sourceMappingURL=firebase.js.map