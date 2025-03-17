import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfigProvider} from "antd";

createRoot(document.getElementById('root')!).render(
    <ConfigProvider theme={{
        "token": {
            "colorPrimary": "#40b774",
            "colorInfo": "#40b774",
            "sizeStep": 6,
            "wireframe": false,
            "fontSize": 18,
            "colorBgBase": "#ffffff"
        }
    }}> <StrictMode>
        <App />
    </StrictMode>
    </ConfigProvider>
,
)
