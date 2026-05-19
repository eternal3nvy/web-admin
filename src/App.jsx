import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './auth/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import Users from './pages/Users'
import LotsPage from './pages/LotsPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout>
              <IndexPage />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/users" element ={
          <ProtectedRoute adminOnly={true} >
            <MainLayout>
              <Users />
            </MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/lots" element = {
          <ProtectedRoute>
            <MainLayout>
              <LotsPage/>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>


    </BrowserRouter>
  )
}

export default App
