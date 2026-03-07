import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { NamespaceProvider } from './context/NamespaceContext';

function App() {
  return (
    <NamespaceProvider>
      <RouterProvider router={router} />
      <Toaster />
    </NamespaceProvider>
  );
}

export default App;