/**
 * 设计规范 - 基于8dp栅格系统
 * 参考：Material Design、Ant Design
 */

export const DesignTokens = {
  // 间距系统 (8dp栅格)
  spacing: {
    xs: 4,      // 0.5x
    sm: 8,      // 1x - 卡片间距、分隔线
    md: 16,     // 2x - 大多数元素留白、屏幕左右对齐基线
    lg: 24,     // 3x - 大间距
    xl: 32,     // 4x - 特大间距
    xxl: 48,    // 6x - 超大间距
  },

  // 按钮尺寸
  button: {
    small: {
      height: 24,
      padding: '0 8px',
      fontSize: 12,
    },
    default: {
      height: 32,
      padding: '4px 16px',
      fontSize: 14,
    },
    large: {
      height: 40,
      padding: '6px 24px',
      fontSize: 16,
    },
  },

  // 输入框尺寸
  input: {
    small: {
      height: 24,
      fontSize: 12,
    },
    default: {
      height: 32,
      fontSize: 14,
    },
    large: {
      height: 40,
      fontSize: 16,
    },
  },

  // 字体大小
  fontSize: {
    xs: 12,
    sm: 14,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },

  // 行高
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // 圆角
  borderRadius: {
    sm: 4,
    base: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // 阴影
  boxShadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },

  // 容器宽度
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
  },

  // 头像尺寸
  avatar: {
    xs: 24,
    sm: 32,
    base: 40,
    lg: 64,
    xl: 80,
  },

  // 图标尺寸
  icon: {
    xs: 12,
    sm: 14,
    base: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },

  // 导航栏高度
  header: {
    mobile: 56,
    desktop: 64,
  },

  // 最小点击区域
  minTouchTarget: 44,
};

export default DesignTokens;
