import { atom, useAtom, PrimitiveAtom } from 'jotai';

const endpointAtom = atom<string>('http://localhost:8080/api');

const projectSlugAtom = atom<string>('fashiona');

interface RequestConstructorIF<
  Args extends Array<PrimitiveAtom<unknown> | unknown>
> {
  (args: Args): {
    url: string;
    method: string;
    headers?: Headers | Record<string, string>;
    body?: FormData | Record<string, unknown>;
  };
}

const apiAtom =
  (
    requestConstructor: RequestConstructorIF<
      (
        | string
        | number
        | object
        | PrimitiveAtom<string>
        | PrimitiveAtom<number>
        | PrimitiveAtom<object>
      )[]
    >,
    responseHandler: (response: Response) => Promise<unknown>,
    dataTransformer: ((data: unknown) => unknown) | null
  ) =>
  (
    args: (
      | string
      | number
      | object
      | PrimitiveAtom<string>
      | PrimitiveAtom<number>
      | PrimitiveAtom<object>
    )[]
  ) => {
    const queryFn = async () => {
      const { url, method, headers, body } = requestConstructor(args);

      const headersFinal =
        headers instanceof Headers ? headers : new Headers(headers);

      const bodyFinal = body instanceof FormData ? body : new FormData();

      if (!(body instanceof FormData)) {
        for (const key in body) {
          if (Object.prototype.hasOwnProperty.call(body, key)) {
            bodyFinal.append(key, JSON.stringify(body[key]));
          }
        }
      }

      const request = new Request(url, {
        method,
        headers: headersFinal,
        body: bodyFinal,
      });

      const response = await fetch(request);
      const data = await responseHandler(response);
      return dataTransformer ? dataTransformer(data) : data;
    };
  };
