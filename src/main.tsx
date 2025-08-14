import './index.css';
import App from './App.tsx';
import "@radix-ui/themes/styles.css";
import { createRoot } from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19';

createRoot(document.getElementById('root')!).render(<App />);