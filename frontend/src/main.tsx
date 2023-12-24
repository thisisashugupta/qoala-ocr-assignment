import App from './App.tsx'
import Home from './components/Home.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, createRoutesFromElements, RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import Layout from './Layout'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path='' element={<App />} />
      <Route path='api' element={<Home />} />
    </Route>
  )
);
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)