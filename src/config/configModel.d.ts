declare namespace ConfigModel {
    export interface NavBarItem {
        key: string;
        label: string;
        path: string;
        icon?: ReactNode;
        children?: NavBarItem[];
    }
}
