import React from 'react'
import ReactDOM from 'react-dom/client'
import RouterComponent from './router'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { RecoilRoot } from 'recoil'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './libs/queryClient'
import { IconContext } from 'react-icons'
import { ToastContainer, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { LoadingOverlay } from './components/Elements/LoadingOverlay'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <HelmetProvider>
        <IconContext.Provider value={{ size: '20px' }}>
          <QueryClientProvider client={queryClient}>
            <LoadingOverlay />
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Slide}
            />
            <RouterComponent />
          </QueryClientProvider>
        </IconContext.Provider>
      </HelmetProvider>
    </RecoilRoot>
  </React.StrictMode>
)
