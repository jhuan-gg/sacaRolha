import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar a instalação PWA
 * Detecta se o app pode ser instalado e fornece funções para controlar o prompt
 */
function usePWAInstall() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado
    const checkIfInstalled = () => {
      // Verifica se está rodando como PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');
      setIsInstalled(isStandalone);
    };

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('PWA: beforeinstallprompt event fired');
      
      // Previne o prompt automático
      e.preventDefault();
      
      // Salva o evento para usar depois
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      console.log('PWA: App foi instalado');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Adiciona os listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verifica o estado inicial
    checkIfInstalled();

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Função para mostrar o prompt de instalação
  const install = async () => {
    if (!deferredPrompt) {
      console.log('PWA: Prompt não disponível');
      return false;
    }

    try {
      setIsInstalling(true);
      
      // Mostra o prompt
      deferredPrompt.prompt();
      
      // Aguarda a escolha do usuário
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`PWA: Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} instalar`);
      
      // Limpa o prompt usado
      setDeferredPrompt(null);
      setIsInstallable(false);
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA: Erro ao mostrar prompt:', error);
      return false;
    } finally {
      setIsInstalling(false);
    }
  };

  // Função para verificar se é dispositivo móvel
  const isMobile = () => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform));
  };

  return {
    isInstallable: isInstallable && !isInstalled,
    isInstalled,
    isMobile: isMobile(),
    isInstalling,
    install
  };
}

export default usePWAInstall;
