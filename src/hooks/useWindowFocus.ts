import { useState, useEffect } from 'react';

/**
 * 监听窗口焦点状态的 Hook
 * 用于确保即使窗口失焦也能显示协作光标
 */
export const useWindowFocus = () => {
  const [windowFocused, setWindowFocused] = useState(true);

  useEffect(() => {
    // 处理窗口焦点变化
    const handleFocus = () => {
      setWindowFocused(true);
      document.body.classList.add('window-focused');
      console.log('🔍 窗口获得焦点');
    };

    const handleBlur = () => {
      setWindowFocused(false);
      document.body.classList.remove('window-focused');
      console.log('🔍 窗口失去焦点');
    };

    // 监听窗口焦点事件
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setWindowFocused(true);
        document.body.classList.add('window-focused');
        console.log('🔍 页面变为可见');
      } else {
        setWindowFocused(false);
        document.body.classList.remove('window-focused');
        console.log('🔍 页面变为隐藏');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 初始状态
    if (document.hasFocus()) {
      document.body.classList.add('window-focused');
    } else {
      document.body.classList.remove('window-focused');
      setWindowFocused(false);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.classList.remove('window-focused');
    };
  }, []);

  return windowFocused;
};

export default useWindowFocus;
