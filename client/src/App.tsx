import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import AppRoutes from '@/routes';

import ClickFX from '@/utils/ClickFX';
import { queryClient } from '@/utils/queryClient';

function App() {
  return (
    <>
      <ClickFX />
      <Toaster
        position='bottom-center'
        richColors
        duration={1500}
        toastOptions={{
          className: 'toast',
          style: {
            fontSize: '1rem',
          },
        }}
      />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </>
  );
}

export default App;
