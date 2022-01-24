export const responseHandlerTemplate = async (response: Response) => {
  if (response.status === 500) {
    throw new Error('Internal Server Error');
  }

  const data = await response.json();

  if (response.status >= 400 && response.status < 500) {
    const err = data.detail ? data.detail : data;
    throw err;
  }

  return data;
};

export const requestTemplate =
  (
    requestConstructor: Function,
    responseHandler: Function = responseHandlerTemplate,
    requireAuthentication: boolean = true
  ) =>
  async (...args: any[]) => {
    const headers = new Headers({ Accept: 'application/json' });

    if (requireAuthentication) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not Authorized');
      }

      headers.set('Authorization', `Bearer ${token}`);
    }

    const { url, method, body } = requestConstructor(...args);
    const request = new Request(url, {
      method: method,
      headers: headers,
      body: body,
    });
    const response = await fetch(request);

    const data = await responseHandler(response);
    return data;
  };

const getImage = requestTemplate((projectSlug: string, file_name: string) => {
  return {
    url:
      '/api/project/data/image?slug=' + projectSlug + '&file_name=' + file_name,
    method: 'GET',
  };
});

export const calcImageSrc = async (projectSlug: string, file_name: string) => {
  const imgBlob = await getImage(projectSlug, file_name);
  const src = URL.createObjectURL(imgBlob);
  return src;
};
