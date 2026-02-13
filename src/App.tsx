import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; // ADD THIS
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import MyTickets from './pages/MyTickets';
import CreateEvent from './pages/CreateEvent';
import Analytics from './pages/Analytics';
import PaymentCallback from './pages/PaymentCallback';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} /> {/* CHANGE THIS */}
            <Route path="events" element={<Events />} />
            <Route path="my-tickets" element={<MyTickets />} />
            <Route path="create-event" element={<CreateEvent />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;