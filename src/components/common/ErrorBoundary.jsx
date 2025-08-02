import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para mostrar a UI de erro
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você pode registrar o erro em um serviço de logging aqui
    console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // UI de fallback customizada
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #395a4f 0%, #432330 100%)',
          padding: '20px',
          fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h1 style={{ 
              color: '#432330', 
              fontSize: '4rem', 
              margin: '0 0 20px 0',
              fontWeight: 'bold'
            }}>
              500
            </h1>
            <h2 style={{ 
              color: '#432330', 
              fontSize: '1.5rem', 
              margin: '0 0 20px 0',
              fontWeight: 'bold'
            }}>
              Ops! Algo deu errado
            </h2>
            <p style={{ 
              color: '#666', 
              fontSize: '1rem', 
              margin: '0 0 30px 0',
              lineHeight: '1.6'
            }}>
              Ocorreu um erro inesperado na aplicação. Nossa equipe foi notificada e está trabalhando para resolver o problema.
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                background: '#853c43',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f25c5e';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#853c43';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Recarregar Página
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '30px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#853c43' }}>
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '15px', 
                  borderRadius: '10px',
                  overflow: 'auto',
                  fontSize: '12px',
                  marginTop: '10px'
                }}>
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            
            <div style={{ marginTop: '30px' }}>
              <small style={{ color: '#999', fontSize: '0.8rem' }}>
                SacaRolha - Confraria
              </small>
            </div>
          </div>
        </div>
      );
    }

    // Se não há erro, renderiza os children normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
