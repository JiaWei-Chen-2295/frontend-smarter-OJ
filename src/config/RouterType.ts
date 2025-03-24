// 扩展 react-router 原生类型
declare module 'react-router' {
    // @ts-expect-error RouteObject
    interface RouteObject {
        meta?: {
            title?: string;
            requiresAuth?: boolean;

        };
    }

    interface AgnosticDataIndexRouteObject {
        meta?: {
            title?: string;
            requiresAuth?: boolean;

        };
    }
}

