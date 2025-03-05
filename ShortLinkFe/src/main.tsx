import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css'; // Import style của Ant Design
import './index.css'; // Import style của Tailwind CSS

import App from './App';

createRoot(document.getElementById('root')!).render(<App />);
