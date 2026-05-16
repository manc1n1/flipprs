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
        draggablePercent={40}
        theme='colored'
        stacked
        className='toastContainer'
        toastClassName='toast'
      />
    </>
  );
}

export default App;
