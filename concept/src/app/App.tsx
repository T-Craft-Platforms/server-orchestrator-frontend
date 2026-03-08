import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { NamespaceProvider } from './context/NamespaceContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';

function App() {
  return (
    <UserPreferencesProvider>
      <NamespaceProvider>
        <RouterProvider router={router} />
        <Toaster />
      </NamespaceProvider>
    </UserPreferencesProvider>
  );
}

export default App;
