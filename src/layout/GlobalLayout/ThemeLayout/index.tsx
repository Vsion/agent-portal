'use client';

import { App } from 'antd';
import { ThemeMode, ThemeProvider } from 'antd-style';
import 'antd/dist/reset.css';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { usePathname, useRouter } from 'next/navigation';
import React, { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';

import { GlobalStyle } from '@/styles';
import { dark, default_theme, light } from '@/theme/themeConfig';
import { initAxiosHooks } from '@/utils/axios';
import { AUTH_DATA } from '@/utils/constants';

import { useAxiosConfig } from '../../AxiosConfigLayout';

const NO_AUTH_ROUTES = new Set([
  '/oidc/callback',
  '/oidc/logout',
  '/oidc/remove-auth-and-login',
  '/oidc/auth',
]);

interface Props extends PropsWithChildren {
  theme?: ThemeMode; // 刷新页面时, 从 cookie 获取保存的 theme, 作为初始值
}

const ThemeLayout = React.memo<Props>(({ children, theme: init_page_theme }) => {
  const { setAxiosConfigured, isAxiosConfigured } = useAxiosConfig();
  const [theme, setTheme] = React.useState<ThemeMode | undefined>(init_page_theme);
  const [mediaQuery, setMediaQuery] = React.useState<any>();
  const theme_from_store = useSelector((store: any) => store.theme);
  const pathname = usePathname();
  const router = useRouter();
  React.useEffect(() => {
    if (NO_AUTH_ROUTES.has(pathname)) {
      return;
    }
    const auth = localStorage.getItem(AUTH_DATA);
    if (!auth) {
      router.push('/oidc/auth');
      return;
    }
    if (!isAxiosConfigured) {
      setAxiosConfigured(initAxiosHooks());
    }
  }, [pathname]);

  const handleThemeChange = React.useCallback(
    (e: MediaQueryListEvent) => {
      if (theme_from_store !== 'auto') return;
      if (e.matches) {
        // console.log('系统为: 暗黑模式');
        setTheme('dark');
      } else {
        // console.log('系统为: 正常（亮色）模式');
        setTheme('light');
      }
    },
    [theme_from_store, setTheme]
  );

  React.useEffect(() => {
    setMediaQuery(window.matchMedia('(prefers-color-scheme: dark)'));
  }, []);
  React.useEffect(() => {
    if (mediaQuery) {
      mediaQuery.addListener(handleThemeChange);
      return () => {
        mediaQuery.removeListener(handleThemeChange);
      };
    }
  }, [mediaQuery, handleThemeChange]);
  React.useEffect(() => {
    if (theme_from_store !== theme) {
      setTheme(theme_from_store);
    }
    if (theme_from_store === 'auto' && mediaQuery) {
      handleThemeChange(mediaQuery);
      return;
    }
  }, [theme_from_store, mediaQuery]);
  const themeConfig =
    theme === 'auto'
      ? default_theme
      : merge(cloneDeep(default_theme), theme === 'dark' ? dark : light);
  return (
    <ThemeProvider
      themeMode={theme} // 主题模式; ps: themeMode 和 appearance 都可以实现效果, themeMode 更贴合目前功能的含义
      // themeMode="auto"
      // appearance={theme} // 外观样式 https://github.com/ant-design/antd-style/issues/52#issuecomment-1563747195
      {...themeConfig}
    >
      <GlobalStyle />
      <App style={{ minHeight: 'inherit', width: 'inherit', fontFamily: 'inherit' }}>
        {children}
      </App>
    </ThemeProvider>
  );
});

export default ThemeLayout;
