
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then((reg) => console.log('SW registered'))
//     .catch((err) => console.log('SW error',err));
// }

createRoot(document.getElementById('root')).render(
   <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
   <AuthProvider>
      <App />
   </AuthProvider>
   </GoogleOAuthProvider>
)
