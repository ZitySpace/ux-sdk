import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useEffect } from 'react';
import { useStore } from 'zustand';
import {
  useContextStore,
  usePagingStore,
  useDataframeStore,
  useCarouselStore,
} from '@zityspace/ux-sdk/stores';
import {
  useCarouselSetSize,
  useCarouselSetPage,
  useContextSetFilter,
  useFilterFromDataframe,
  requestTemplate,
  QueryProvider,
} from '@zityspace/ux-sdk/hooks';
import {
  CodeEditor,
  DataFrame,
  PaginationBar,
  ImageCarousel,
} from '@zityspace/ux-sdk/components';

export default {
  title: 'UX-SDK/CodeEditor',
  component: CodeEditor,
} as ComponentMeta<typeof CodeEditor>;

const code = `res = df.groupby('category').size().to_frame('count')`;

const runCode = requestTemplate(
  (code: string) => {
    return {
      url: 'http://localhost:8008',
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

const Template: ComponentStory<any> = (args) => {
  const Story = () => {
    const pagingStore = usePagingStore(args.DataFrame.pagingStoreName);
    const dataframeStore = useDataframeStore(args.DataFrame.dataframeStoreName);
    const contextStore = useContextStore(args.Carousel.contextStoreName);
    const carouselStore = useCarouselStore(args.Carousel.carouselStoreName);

    const setCarouselSize = useCarouselSetSize({
      contextStore,
      pagingStore,
    });
    const setCarouselPage = useCarouselSetPage({
      contextStore,
      pagingStore,
      carouselStore,
    });

    const sizeQuery = setCarouselSize();
    const pageQuery = setCarouselPage();

    const setContextFilter = useContextSetFilter({
      pagingStore: pagingStore,
      contextStore: contextStore,
    });

    const [header, data, setDataframe] = useStore(dataframeStore, (s) => [
      s.header,
      s.data,
      s.setDataframe,
    ]);

    // Optimization Note
    // https://react-query.tanstack.com/guides/query-keys
    // due to how react query compare queryKeys, when update context filters, it is recommended:
    // 1. regenerate filterOpt when dependencies changed
    // 2. use a unique filterOpt.value to identify this update
    // Otherwise, for filterOpt with {value: null, dependsOnValue: false}, useCarouselSizeQuery
    // and useCarouselPageQuery won't be able to pick up filtering's change, thus will
    // return cached query results. However, paging will trigger the latest query due to change
    // of pos and step.

    useEffect(() => {
      const filter = useFilterFromDataframe({ header, data });
      setContextFilter(filter);
    }, [header, data]);

    if (sizeQuery.isLoading || pageQuery.isLoading) return <></>;

    return (
      <>
        <CodeEditor
          onCodeRun={runCode}
          onSuccessCallback={setDataframe}
          {...args.CodeEditor}
        />
        <DataFrame {...args.DataFrame} />
        <PaginationBar pagingStoreName={args.DataFrame.pagingStoreName} />
        <ImageCarousel carouselStoreName={args.Carousel.carouselStoreName} />
      </>
    );
  };

  return (
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

export const Story = Template.bind({});
Story.args = {
  CodeEditor: {
    title: 'DataFrame Query Box',
    initCode: code,
    placeholder: 'write pandas dataframe query here',
  },
  DataFrame: {
    title: 'Query Result',
    dataframeStoreName: 'CodeEditor.stories.dataframeStore',
    pagingStoreName: 'CodeEditor.stories.pagingStore',
  },
  Carousel: {
    contextStoreName: 'CodeEditor.stories.contextStore',
    carouselStoreName: 'CodeEditor.stories.carouselStore',
  },
};
