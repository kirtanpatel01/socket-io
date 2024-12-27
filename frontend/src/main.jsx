import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_REACT_APP_SOCKET_URL || 'http://localhost:8000';
console.log(socketUrl)
const socket = io(socketUrl);

socket.on('connect', () => {
  console.log('Connected to server!');
});

socket.on('connect_error', (err) => {
  console.error('Connection error:', err);
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App socket={socket}/>
  </StrictMode>,
)
