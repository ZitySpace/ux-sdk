import React, { useEffect } from 'react';

import { IFrameAuthChild } from '@ZitySpace/iframe-auth';

const getCookie = (cname: string) => {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

const Auth = ({ children }: { children?: React.ReactNode }) => {
  useEffect(() => {
    ['apiEndpoint', 'projectSlug', 'token'].map((key: string) => {
      const val = getCookie(key);
      if (val)
        localStorage.setItem(
          key,
          key === 'apiEndpoint' ? val.slice(1, val.length - 1) : val
        );
    });
  }, []);

  return (
    <IFrameAuthChild url='http://localhost:3000'>{children}</IFrameAuthChild>
  );
};

export default Auth;
