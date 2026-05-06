import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';

import AppRoutes from '@/routes';

import ClickFX from '@/utils/ClickFX';
import { queryClient } from '@/utils/queryClient';

function App() {
  return (
    <>
      <ClickFX />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
      <ToastContainer
        position='bottom-center'
        autoClose={1500}
        hideProgressBar={false}
        pauseOnHover
        draggable
        draggablePercent={60}
        theme='colored'
        stacked
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        toastStyle={{
          fontFamily: 'runescape-bold',
          marginBottom: '1rem',
          borderRadius: 'var(--toastify-toast-bd-radius)',
        }}
      />
    </>
  );
}

export default App;
