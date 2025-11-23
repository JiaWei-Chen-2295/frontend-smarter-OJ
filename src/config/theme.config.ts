import type { ThemeConfig } from 'antd';

export const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#228B22',
    colorInfo: '#228B22',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    borderRadius: 6,
    fontSize: 14,
    colorPrimaryBg: '#228B22',
    colorPrimaryBgHover: '#2ea043',
    colorPrimaryBorder: '#228B22',
    colorPrimaryBorderHover: '#2ea043',
    colorPrimaryHover: '#2ea043',
    colorPrimaryActive: '#1e7b1e',
    colorPrimaryTextHover: '#2ea043',
    colorPrimaryText: '#228B22',
    colorPrimaryTextActive: '#1e7b1e',
  },
  components: {
    Button: {
      colorPrimary: '#228B22',
      colorPrimaryHover: '#2ea043',
      colorPrimaryActive: '#1e7b1e',
      primaryShadow: 'none',
      algorithm: true,
    },
    Menu: {
      itemSelectedBg: '#f0f9f0',
      itemSelectedColor: '#228B22',
    },
    Tag: {
      colorPrimary: '#228B22',
    },
  },
};

export const darkThemeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#228B22',
    colorInfo: '#228B22',
    colorBgContainer: '#141414',
    colorBgLayout: '#141414',
    colorText: '#ffffff',
    colorTextSecondary: '#a6a6a6',
    colorBorder: '#303030',
    borderRadius: 6,
  },
};
