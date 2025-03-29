import {StrictMode, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ConfigProvider} from "antd";
import {Provider} from "react-redux";
import {store} from "./context/store.ts";
import {getCurrentUser} from "./features/userSlice.ts";
import './plugins/ojaxios.ts'
import 'bytemd/dist/index.css'

function logMayDayLyrics() {
    console.log('%c五月天 - 顽固%c',
        'font-size: 24px; ' +
        'font-weight: bold; ' +
        'text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); ' +
        'padding: 10px; ' +
        'background: linear-gradient(45deg, #a7c957, #6a994e); ' +
        'border-radius: 12px;',
        'color: #ecf0f1; ' +
        'font-size: 14px; ' +
        'padding-left: 20px;'
    );

    const lyricStyle =
        'color: #2c3e50; ' +
        'font-size: 16px; ' +
        'font-style: italic; ' +
        'padding: 8px 15px; ' +
        'background: rgba(189, 195, 199, 0.8); ' +
        'border-left: 4px solid #6a994e; ' +
        'margin: 5px 0; ' +
        'box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);';

    console.log('\n%c「走过的 叫足迹」', lyricStyle);
    console.log('%c「走不到 叫憧憬」', lyricStyle);

    console.log('%c「学会收拾起叛逆」', lyricStyle);
    console.log('%c「学会隐藏了表情」', lyricStyle);

    console.log('%c「卸下了 这面具」', lyricStyle);
    console.log('%c「我想说 谢谢你」', lyricStyle);

    console.log('\n%c「谢谢你 一路陪我到这里」',
        'color: #fff; ' +
        'font-size: 18px; ' +
        'background: #6a994e; ' + // 小麦绿
        'padding: 10px 15px; ' +
        'border-radius: 8px; ' +
        'box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);'
    );

    console.log('\n%c❤️✨ %c祝君安好%c ✨❤️',
        'color: #e67e22; ' +
        'font-size: 14px;',
        'color: #6a994e; ' + // 小麦绿
        'font-weight: bold;',
        'color: #e67e22;'
    );
}

/**
 * 初始化函数
 * 全局项目入口
 */
const onInit = () => {
    logMayDayLyrics()
    store.dispatch(getCurrentUser())
}

onInit()

createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
        <ConfigProvider theme={{
            "token": {
                "colorPrimary": "#228B22",
                "colorInfo": "#228B22",
                "sizeStep": 6,
                "wireframe": false,
                "fontSize": 16,
                "colorBgBase": "#ffffff"
            }
        }}> <StrictMode>
            <App />
        </StrictMode>
        </ConfigProvider>
    </Provider>
,
)


