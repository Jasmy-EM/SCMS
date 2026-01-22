import React from 'react';
import { useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { getRoutes } from './routes';

function App() {
  const { currentRole } = useAuth();
  const routes = getRoutes(currentRole);
  const element = useRoutes(routes);

  return element;
}

export default App;
