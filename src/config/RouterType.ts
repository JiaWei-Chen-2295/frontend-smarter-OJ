// 扩展 react-router 原生类型
declare module 'react-router' {
    // @ts-expect-error RouteObject
    interface RouteObject {
        meta?: {
            title?: string;
            requiresAuth?: boolean;
            // 可在此继续扩展字段
        };
    }
}

