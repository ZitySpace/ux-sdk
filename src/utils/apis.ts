import { CarouselStoreStateData, ImageProps } from '../stores/carouselStore';

const responseHandlerTemplate = async (response: Response) => {
  if (response.status === 401) {
    throw new Error('Not Authorized');
  }

  if (response.status === 500) {
    throw new Error('Internal Server Error');
  }

  const data = await response.json();

  if (response.status > 401 && response.status < 500) {
    const err = data.detail ? data.detail : data;
    throw err;
  }

  return data;
};

const requestTemplate =
  (
    requestConstructor: Function,
    responseHandler: Function = responseHandlerTemplate,
    dataNormalizer: Function | null = null,
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

    return dataNormalizer ? dataNormalizer(data) : data;
  };

// const getImage = requestTemplate((file_name: string) => {
//   return {
//     url:
//       apiEndpoint +
//       '/project/data/image?slug=' +
//       projectSlug +
//       '&file_name=' +
//       file_name,
//     method: 'GET',
//   };
// });

// export const calcImageSrc = async (file_name: string) => {
//   const imgBlob = await getImage(projectSlug, file_name);
//   const src = URL.createObjectURL(imgBlob);
//   return src;
// };

export interface ImageMetaProps {
  id: number;
  file_name: string;
  file_size: number;
  image_area: number;
  image_height: number;
  image_width: number;
  upload_time: string;
  annotations: {
    x: number;
    y: number;
    w: number;
    h: number;
    category: string;
    timestamp_z: string;
    unique_hash_z: string;
  }[];
}

export const normalizeImagesMeta = (data: ImageMetaProps[]) => ({
  carouselData: data.reduce(
    (res: CarouselStoreStateData['carouselData'], d: ImageMetaProps) => {
      return {
        ...res,
        [d.file_name]: {
          id: d.id,
          name: d.file_name,
          file_size: d.file_size,
          image_area: d.image_area,
          height: d.image_height,
          width: d.image_width,
          upload_time: d.upload_time,
          annotations: d.annotations,
        },
      };
    },
    {}
  ),
  selection: {
    selectable: true,
    selected: data.reduce(
      (
        res: CarouselStoreStateData['selection']['selected'],
        d: ImageMetaProps
      ) => {
        return {
          ...res,
          [d.file_name]: false,
        };
      },
      {}
    ),
  },
});

export const useAPIs = () => {
  const apiEndpoint = localStorage.getItem('apiEndpoint');
  const projectSlug = localStorage.getItem('projectSlug');

  const getImagesCount = requestTemplate(() => {
    return {
      url: apiEndpoint + '/project/data/images/count?slug=' + projectSlug,
      method: 'GET',
    };
  });

  const getImagesMeta = requestTemplate(
    (offset: number, limit: number, order_by: string) => {
      return {
        url:
          apiEndpoint +
          '/project/data/images/meta?slug=' +
          projectSlug +
          '&offset=' +
          offset +
          '&limit=' +
          limit +
          '&order_by=' +
          order_by,
        method: 'GET',
      };
    },
    ...[,],
    normalizeImagesMeta
  );

  return { getImagesCount, getImagesMeta };
};
