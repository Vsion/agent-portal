'use client';

export { sdk as bffClient } from '@tenx-ui/bff-client';
export { sdk as bff } from '@yuntijs/arcadia-bff-sdk';

export const getCookie = (cookieString: string, cookieName: string) => {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(cookieString);
  const ca = decodedCookie.split(';');

  for (const cookie of ca) {
    const c = cookie.trim();
    if (c.startsWith(name)) {
      return c.slice(name.length);
    }
  }
  return '';
};

/**
 * 设置一个 cookie。
 * @param {string} name Cookie 的名称。
 * @param {string} value Cookie 的值。
 * @param {number} [days] Cookie 的过期时间（天数）。如果不设置，默认为会话 Cookie。
 * @param {string} [path] Cookie 的路径。默认为根路径 '/'。
 */
export const setCookie = (name: string, value: string, days?: number, path?: string) => {
  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days || 1) * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  if (typeof window.document === 'object') {
    // eslint-disable-next-line unicorn/no-document-cookie
    window.document.cookie = `${name}=${value}${expires}; path=${path || '/'}`;
  }
};

interface ParsedToken {
  alg: string;
  kid: string;
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  at_hash: string;
  c_hash: string;
  email: string;
  email_verified: boolean;
  groups: string[];
  name: string;
  preferred_username: string;
}

/**
 * 判断 auth 是否过期。
 * @param {string} id_token token.id_token。
 */

function parseToken(token: string): ParsedToken {
  return token
    .split('.')
    .map(str => {
      try {
        return JSON.parse(atob(str));
      } catch (error) {
        console.warn('parer token err', error);
      }
      return {};
    })
    .reduce(
      (pr, cu) => ({
        ...pr,
        ...cu,
      }),
      {}
    );
}

export function isTokenExpired(id_token?: string): boolean {
  if (!id_token) {
    return true;
  }
  const expiredTimestampInMs = parseToken(id_token).exp * 1000;
  return Date.now() >= expiredTimestampInMs;
}
