import { useNavigate } from 'react-router-dom';

export const useErrorNavigation = () => {
  const navigate = useNavigate();

  const navigateToError = (errorType = '404') => {
    switch (errorType) {
      case '500':
      case 'server':
        navigate('/error/500');
        break;
      case '403':
      case 'unauthorized':
        navigate('/error/403');
        break;
      case '404':
      case 'notfound':
      default:
        navigate('/404');
        break;
    }
  };

  const navigateToHome = () => {
    navigate('/login');
  };

  const navigateBack = () => {
    navigate(-1);
  };

  return {
    navigateToError,
    navigateToHome,
    navigateBack,
  };
};
