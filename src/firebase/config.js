// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Verificar se as variáveis de ambiente estão carregadas
if (!firebaseConfig.apiKey) {
  console.error('❌ Configuração do Firebase não encontrada. Verifique o arquivo .env');
  console.log('Variáveis necessárias:', Object.keys(firebaseConfig));
} else {
  console.log('✅ Configuração do Firebase carregada');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Configurações para melhor experiência de desenvolvimento
if (import.meta.env.DEV) {
  // Configurações otimizadas para desenvolvimento
  auth.settings = {
    appVerificationDisabledForTesting: false
  };
  
  // Log das configurações em desenvolvimento
  console.log('🔧 Firebase Auth configurado para desenvolvimento');
  console.log('🔧 Firestore configurado para desenvolvimento');
  
  // Habilita persistência offline para melhor performance
  try {
    import('firebase/firestore').then(({ enableIndexedDbPersistence }) => {
      enableIndexedDbPersistence(db, {
        forceOwnership: false
      }).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('🔔 Múltiplas abas abertas, persistência limitada');
        } else if (err.code === 'unimplemented') {
          console.warn('🔔 Navegador não suporta persistência');
        }
      });
    });
  } catch (error) {
    console.warn('Persistência offline não disponível:', error.message);
  }
}

// Detecta problemas de conectividade
let connectionStatus = navigator.onLine;
export const isOnline = () => connectionStatus;

// Monitora status da conexão
window.addEventListener('online', () => {
  connectionStatus = true;
  console.log('🔗 Conexão restaurada');
});

window.addEventListener('offline', () => {
  connectionStatus = false;
  console.log('📴 Modo offline ativado');
});

// Exporta todas as funções necessárias
export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

export {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';

export default app;
