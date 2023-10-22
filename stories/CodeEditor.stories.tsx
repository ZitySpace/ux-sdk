import { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import {
  useAtom,
  useSetAtom,
  Provider,
  createStore,
  useAtomValue,
} from 'jotai';
import { filterAtom, apiEndpointAtom, dataframeAtom } from '@/atoms';
import { requestTemplate } from '@/utils';
import { QueryProvider, useCarouselSetPage, useCarouselSetSize } from '@/hooks';
import {
  CodeEditor,
  DataFrame,
  PaginationBar,
  ImageCarousel,
  ImageList,
  Annotator,
} from '@/components';

const meta: Meta<typeof CodeEditor> = {
  title: 'UX-SDK/CodeEditor',
  component: CodeEditor,
};
export default meta;

const dataframeStore = createStore();

const imageCarouselStore = createStore();

const Template = (args: any) => {
  const QueriedDataFrame = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div className='us-flex us-flex-col'>
        <DataFrame hideTitle={true} />
        <PaginationBar />
      </div>
    );
  };

  const QueriedImageCarousel = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div className='us-flex us-flex-col us-space-y-2'>
        <div className='us-flex us-flex-col'>
          <div className='us-w-full us-grid us-grid-cols-3 us-gap-2 us-h-[720px]'>
            <div className='us-max-h-full us-overflow-y-scroll'>
              <ImageList hideTitle={true} />
            </div>
            <div className='us-max-h-full us-overflow-y-scroll us-col-span-2'>
              <ImageCarousel hideTitle={true} />
            </div>
          </div>
          <PaginationBar />
        </div>
        <div className='us-h-[640px]'>
          <Annotator hideTitle={true} />
        </div>
      </div>
    );
  };

  const Story = () => {
    const [apiEndpoint, setApiEndpoint] = useAtom(apiEndpointAtom);

    const [dataframe, setDataframe] = useAtom(dataframeAtom);
    const { config } = dataframe;

    dataframeStore.set(apiEndpointAtom, apiEndpoint);
    dataframeStore.set(filterAtom, { choice: 'byDataframe', value: config });
    imageCarouselStore.set(apiEndpointAtom, apiEndpoint);
    imageCarouselStore.set(filterAtom, {
      choice: 'byDataframeGroupByImage',
      value: config,
    });

    const code = `res = df.groupby('category').size().to_frame('count')`;

    const runCode = requestTemplate(
      (code: string) => {
        return {
          url: `${apiEndpoint}/queries`,
          method: 'POST',
          headers: new Headers({
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            code: code,
          }),
        };
      },
      ...[,],
      ...[,],
      false
    );

    useEffect(() => {
      setApiEndpoint(`/formula-serv/zityspace/annotation-query/default`);
    }, []);

    return (
      <div className='us-flex us-flex-col us-space-y-2'>
        <CodeEditor
          onCodeRun={runCode}
          onSuccessCallback={({
            header,
            data,
          }: {
            header: string[];
            data: any[][];
          }) =>
            setDataframe({
              header,
              data,
              selected: Array(data.length).fill(false),
            })
          }
          initCode={code}
          {...args.CodeEditor}
        />

        <Provider store={dataframeStore}>
          <QueriedDataFrame />
        </Provider>

        <Provider store={imageCarouselStore}>
          <QueriedImageCarousel />
        </Provider>
      </div>
    );
  };

  return (
    <Provider>
      <QueryProvider>
        <Story />
      </QueryProvider>
    </Provider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    CodeEditor: {
      title: 'DataFrame Query Box',
      placeholder: 'write pandas dataframe query here',
    },
    DataFrame: {
      title: 'Query Result',
    },
  },
};
