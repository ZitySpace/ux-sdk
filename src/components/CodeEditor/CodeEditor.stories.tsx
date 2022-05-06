import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useEffect } from 'react';
import CodeEditor from './CodeEditor';
import { requestTemplate } from '../../utils/apis';
import DataFrame from '../DataFrame';
import PaginationBar from '../PaginationBar';
import ImageCarousel from '../ImageCarousel';
import { useContextStore } from '../../stores/contextStore';
import { usePagingStore } from '../../stores/pagingStore';
import { useDataframeStore } from '../../stores/dataframeStore';
import { useCarouselStore } from '../../stores/carouselStore';
import {
  useSetFiltering,
  useSetDataframe,
  useFilterFromDataframe,
} from '../../utils';
import { useCarouselQueries } from '../../utils/hooks/useCarouselQueries';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useStore } from 'zustand';

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

const queryClient = new QueryClient();

const Template: ComponentStory<any> = (args) => {
  const Story = () => {
    const pagingStore = usePagingStore(args.DataFrame.pagingStoreName);
    const dataframeStore = useDataframeStore(args.DataFrame.dataframeStoreName);
    const contextStore = useContextStore(args.Carousel.contextStoreName);
    const carouselStore = useCarouselStore(args.Carousel.carouselStoreName);

    const { setDataframe } = useSetDataframe({
      dataframeStore: dataframeStore,
    });

    const { useCarouselSizeQuery, useCarouselPageQuery } = useCarouselQueries({
      contextStore: contextStore,
      pagingStore: pagingStore,
      carouselStore: carouselStore,
    });

    const sizeQuery = useCarouselSizeQuery();
    const pageQuery = useCarouselPageQuery();

    const { setFiltering } = useSetFiltering({
      pagingStore: pagingStore,
      contextStore: contextStore,
    });

    const [header, data] = useStore(dataframeStore, (s) => [s.header, s.data]);

    // Optimization Note
    // https://react-query.tanstack.com/guides/query-keys
    // due to how react query compare queryKeys, when update context filters, it is recommended:
    // 1. regenerate filterOpt when dependencies changed
    // 2. use a unique filterOpt.value identify this update
    // Otherwise, for filterOpt with {value: null, dependsOnValue: false}, useCarouselSizeQuery
    // and useCarouselPageQuery won't be able to pick up filtering's change, thus will
    // return cached query results. However, paging will trigger the latest query because change
    // of pos and step.

    useEffect(() => {
      const filterOpt = useFilterFromDataframe({ header, data });
      setFiltering(filterOpt);
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
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
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
