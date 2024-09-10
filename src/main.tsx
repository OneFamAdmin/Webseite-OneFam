import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Imprint from './components/Imprint/Imprint';
import { ScrollProvider } from './context/ScrollContext';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
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
