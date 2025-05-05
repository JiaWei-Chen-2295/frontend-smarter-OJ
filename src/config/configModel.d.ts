import { ReactNode } from 'react';

declare namespace ConfigModel {
    export interface NavBarItem {
        key: string;
        label: string;
        path: string;
        icon?: ReactNode;
        children?: NavBarItem[];
    }
    
    export interface TabsItem {
        key: string;
        label: string;
        path: string;
    }
}
