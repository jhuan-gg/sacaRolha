import React from 'react';
import Error from './Error';

function Unauthorized() {
  return (
    <Error
      errorCode="403"
      title="Acesso negado"
      message="Você não tem permissão para acessar esta página. Faça login ou entre em contato com o administrador."
      showBackButton={false}
      showHomeButton={true}
    />
  );
}

export default Unauthorized;
