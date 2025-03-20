import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfigProvider} from "antd";
import {Provider} from "react-redux";
import {store} from "./context/store.ts";



createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ConfigProvider theme={{
            "token": {
                "colorPrimary": "#228B22",
                "colorInfo": "#228B22",
                "sizeStep": 6,
                "wireframe": false,
                "fontSize": 18,
                "colorBgBase": "#ffffff"
            }
        }}> <StrictMode>
            <App />
        </StrictMode>
        </ConfigProvider>
    </Provider>
,
)


