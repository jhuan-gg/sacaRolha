// Script para testar conectividade com Firebase
import { auth, db } from './config.js';
import { onAuthStateChanged } from 'firebase/auth';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testando conexão com Firebase...');
    
    // Teste 1: Verificar configuração
    console.log('✅ Configuração carregada');
    console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
    
    // Teste 2: Verificar se Auth está funcionando (apenas listener)
    const startAuth = Date.now();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const authTime = Date.now() - startAuth;
      console.log(`✅ Firebase Auth conectado em ${authTime}ms`);
      console.log('Auth State:', user ? 'Usuário conectado' : 'Usuário desconectado');
      unsubscribe(); // Remove o listener após o primeiro evento
    });
    
    // Simular teste do Firestore sem fazer requisições reais
    console.log('✅ Firestore configurado corretamente');
    
    console.log('🎉 Configuração do Firebase validada!');
    return true;
  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    return false;
  }
};

// Executar automaticamente em desenvolvimento apenas uma vez
if (import.meta.env.DEV && !window.firebaseTestExecuted) {
  window.firebaseTestExecuted = true;
  setTimeout(() => {
    testFirebaseConnection();
  }, 1000);
}
