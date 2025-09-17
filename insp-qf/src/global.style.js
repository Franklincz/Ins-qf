import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
*, *::before, *::after {
    box-sizing: border-box;
  }

  body, html {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden; 
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
  /* Transiciones suaves para el sidebar */
.sidebar-transition {
  transition-property: transform, width, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Mejorar el scroll en el sidebar si es necesario */
.sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: #c7d2fe #f5f3ff;
}

.sidebar-scroll::-webkit-scrollbar {
  width: 6px;
}

.sidebar-scroll::-webkit-scrollbar-track {
  background: #f5f3ff;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: #c7d2fe;
  border-radius: 3px;
}
  
`;

export default GlobalStyles;