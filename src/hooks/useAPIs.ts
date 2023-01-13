import { CarouselStoreData } from '../stores/carouselStore';

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

const getImageResponseHandler = async (response: Response) => {
  if (response.status === 401) {
    throw new Error('Not Authorized');
  }

  if (response.status === 500) {
    throw new Error('Internal Server Error');
  }

  const data = await response.blob();

  if (response.status > 401 && response.status < 500) {
    const err = JSON.parse(await data.text());
    throw new Error(err.detail);
  }

  return data;
};

export const requestTemplate =
  (
    requestConstructor: Function,
    responseHandler: Function = responseHandlerTemplate,
    dataTransformer: Function | null = null,
    requireAuthentication: boolean = true
  ) =>
  async (...args: any[]) => {
    const { url, method, headers, body } = requestConstructor(...args);
    const headersFinal = headers || new Headers({ Accept: 'application/json' });

    if (requireAuthentication) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not Authorized');
      }

      headersFinal.set('Authorization', `Bearer ${token}`);
    }

    const request = new Request(url, {
      method: method,
      headers: headersFinal,
      body: body,
    });
    const response = await fetch(request);

    const data = await responseHandler(response);

    return dataTransformer ? dataTransformer(data) : data;
  };

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
    (res: CarouselStoreData['carouselData'], d: ImageMetaProps) => {
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
    selected: data.reduce(
      (res: CarouselStoreData['selection']['selected'], d: ImageMetaProps) => {
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

  const getImagesCount: { (): Promise<number> } = requestTemplate(() => {
    return {
      url: apiEndpoint + '/project/data/images/count?slug=' + projectSlug,
      method: 'GET',
    };
  });

  const getImagesMeta: {
    (
      offset: number,
      limit: number,
      order_by: string
    ): Promise<CarouselStoreData>;
  } = requestTemplate(
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

  const getImage = requestTemplate(
    (file_name: string) => {
      return {
        url:
          apiEndpoint +
          '/project/data/image?slug=' +
          projectSlug +
          '&file_name=' +
          file_name,
        method: 'GET',
      };
    },
    getImageResponseHandler,
    URL.createObjectURL
  );

  const getImagesCountByCategory: { (category: string): Promise<number> } =
    requestTemplate((category: string) => {
      return {
        url:
          apiEndpoint +
          '/project/data/images/category/count?slug=' +
          projectSlug +
          '&category=' +
          category,
        method: 'GET',
      };
    });

  const getImagesMetaByCategory: {
    (
      category: string,
      offset: number,
      limit: number,
      order_by: string
    ): Promise<CarouselStoreData>;
  } = requestTemplate(
    (category: string, offset: number, limit: number, order_by: string) => {
      return {
        url:
          apiEndpoint +
          '/project/data/images/category/meta?slug=' +
          projectSlug +
          '&category=' +
          category +
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

  const deleteImages = requestTemplate(
    (filenames: string[], keepAnnotations: boolean = false) => {
      const formData = new FormData();
      formData.set('slug', projectSlug!);
      formData.set('filenames', JSON.stringify(filenames));
      formData.set('keep_annotations', JSON.stringify(keepAnnotations));

      return {
        url: apiEndpoint + '/project/data/images',
        method: 'DELETE',
        body: formData,
      };
    }
  );

  return {
    getImagesCount,
    getImagesMeta,
    getImage,
    getImagesCountByCategory,
    getImagesMetaByCategory,
    deleteImages,
  };
};
