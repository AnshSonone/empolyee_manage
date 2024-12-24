import { useState, useEffect } from 'react'
import "@radix-ui/themes/styles.css";
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { Theme } from "@radix-ui/themes";
import ProtectedRoute from "./hooks/ProtectedRoute";
import axios from 'axios';
import Cookies from 'js-cookie';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import ActiivationToken from './pages/ActivationToken'
import ResetPasswordToken from './pages/ResetPasswordToken';
import EmailForgotPassword from './pages/EmailForgotPassword'
import LeavesForm from './pages/LeavesForm';
import LeavePage from './pages/LeavePage';
import TaskPage from './pages/TaskPage';
import NotFound from './pages/NotFound';
import TaskForm from './pages/TaskForm';

function App() {

  return (
    <main>
      <Theme accentColor='cyan'  appearance='dark'>
      <Router>
        <Routes>
          {/* PRIVATE ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<HomePage />}/>
            <Route path='/leaveForm' element={<LeavesForm />} />
            <Route path='/leaves' element={<LeavePage />} />
            <Route path='/tasks' element={<TaskPage />} />
            <Route path='/task_form' element={<TaskForm />} />
          </Route>

          {/* PUBLIC ROUTES */}
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/activation/:uid/:token' element={<ActiivationToken />} />
          <Route path='/forgot_password' element={<EmailForgotPassword />} />
          <Route path='/forgot/:uid/:token' element={<ResetPasswordToken />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
          </Theme>
    </main>
  )
}

export default App
