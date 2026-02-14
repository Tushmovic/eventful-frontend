import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicHeader from './components/PublicHeader';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';
import CreateEvent from './pages/CreateEvent';
import Analytics from './pages/Analytics';
import VerifyTicket from './pages/VerifyTicket';
import PaymentCallback from './pages/PaymentCallback';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import Profile from './pages/Profile';
import Contact from './pages/Contact';

// Public pages
import PublicEvents from './pages/PublicEvents';
import PublicEventDetails from './pages/PublicEventDetails';

// Footer pages
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import Press from './pages/Press';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiePolicy from './pages/CookiePolicy';
import Security from './pages/Security';
import HelpCenter from './pages/HelpCenter';
import Documentation from './pages/Documentation';
import APIStatus from './pages/APIStatus';
import Community from './pages/Community';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes with PublicHeader */}
            <Route path="/" element={<><PublicHeader /><Landing /></>} />
            <Route path="/login" element={<><PublicHeader /><Login /></>} />
            <Route path="/register" element={<><PublicHeader /><Register /></>} />
            <Route path="/contact" element={<><PublicHeader /><Contact /></>} />
            <Route path="/payment/callback" element={<><PublicHeader /><PaymentCallback /></>} />
            <Route path="/payment/success" element={<><PublicHeader /><PaymentSuccess /></>} />
            <Route path="/payment/failed" element={<><PublicHeader /><PaymentFailed /></>} />
            
            {/* Public event browsing routes */}
            <Route path="/events" element={<><PublicHeader /><PublicEvents /></>} />
            <Route path="/events/:id" element={<><PublicHeader /><PublicEventDetails /></>} />
            
            {/* Footer pages */}
            <Route path="/features" element={<><PublicHeader /><Features /></>} />
            <Route path="/pricing" element={<><PublicHeader /><Pricing /></>} />
            <Route path="/faq" element={<><PublicHeader /><FAQ /></>} />
            <Route path="/blog" element={<><PublicHeader /><Blog /></>} />
            <Route path="/about" element={<><PublicHeader /><AboutUs /></>} />
            <Route path="/careers" element={<><PublicHeader /><Careers /></>} />
            <Route path="/press" element={<><PublicHeader /><Press /></>} />
            <Route path="/terms" element={<><PublicHeader /><TermsOfService /></>} />
            <Route path="/privacy" element={<><PublicHeader /><PrivacyPolicy /></>} />
            <Route path="/cookies" element={<><PublicHeader /><CookiePolicy /></>} />
            <Route path="/security" element={<><PublicHeader /><Security /></>} />
            <Route path="/help" element={<><PublicHeader /><HelpCenter /></>} />
            <Route path="/docs" element={<><PublicHeader /><Documentation /></>} />
            <Route path="/api-status" element={<><PublicHeader /><APIStatus /></>} />
            <Route path="/community" element={<><PublicHeader /><Community /></>} />
            
            {/* Protected routes with Layout */}
            <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/app/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetails />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="create-event" element={<CreateEvent />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="verify" element={<VerifyTicket />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;