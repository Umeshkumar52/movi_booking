
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './context/AuthProvider.jsx'

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//     .register('/firebase-messaging-sw.js')
//     .then((reg) => console.log('SW registered'))
//     .catch((err) => console.log('SW error',err));
// }

createRoot(document.getElementById('root')).render(
   <AuthProvider>
      <App />
   </AuthProvider>
)
