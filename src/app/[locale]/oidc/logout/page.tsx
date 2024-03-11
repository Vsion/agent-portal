'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { AUTH_DATA } from '@/utils/constants';

export default function Logout() {
  const router = useRouter();
  React.useEffect(() => {
    window.localStorage.removeItem(AUTH_DATA);
    // router.push('/oidc/remove-auth-and-login'); // 是否需要登出 ? 参考豆包, 跳转到未登录的状态体验好点
    router.push('/');
  });
  return <></>;
}
