import React from 'react';
import Error from './Error';

function NotFound() {
  return (
    <Error
      errorCode="404"
      title="Página não encontrada"
      message="A página que você está procurando não existe ou foi movida. Verifique a URL ou use os botões abaixo para navegar."
      showBackButton={true}
      showHomeButton={true}
    />
  );
}

export default NotFound;
