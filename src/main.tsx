import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Landing from './components/Landing/Landing';
import Imprint from './components/Imprint/Imprint';
import { ScrollProvider } from './context/ScrollContext';
import './index.css'
import './utils/i18n';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Landing />} />
      <Route path='/imprint' element={<Imprint />} />
    </Route>
  )
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScrollProvider>
      <RouterProvider router={router} />
    </ScrollProvider>
  </StrictMode>,
)
