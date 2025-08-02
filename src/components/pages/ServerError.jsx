import React from 'react';
import Error from './Error';

function ServerError() {
  return (
    <Error
      errorCode="500"
      title="Erro interno do servidor"
      message="Ocorreu um erro interno no servidor. Nossa equipe foi notificada e está trabalhando para resolver o problema."
      showBackButton={true}
      showHomeButton={true}
    />
  );
}

export default ServerError;
