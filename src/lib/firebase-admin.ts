import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseConfig = {
    type: "service_account",
    projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID ?? '',
    privateKey: (import.meta.env.FIREBASE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    clientEmail: import.meta.env.FIREBASE_CLIENT_EMAIL ?? '',
}

const app = getApps()[0] ?? initializeApp({
    credential: cert(firebaseConfig),
});

export const db = getFirestore(app);