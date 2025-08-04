import React from 'react';
import { Fade } from '@mui/material';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

// CSS personalizado para as transições
const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
};

function PageTransition({ children, timeout = 300 }) {
  const location = useLocation();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Fade 
        key={location.pathname}
        in={true} 
        timeout={timeout}
        appear={true}
      >
        <div style={{ 
          minHeight: '100vh',
          width: '100%'
        }}>
          {children}
        </div>
      </Fade>
    </div>
  );
}

export default PageTransition;
