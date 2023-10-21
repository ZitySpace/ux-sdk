import { Meta, StoryObj } from '@storybook/react';
import React, { useEffect } from 'react';
import { useSetAtom, Provider } from 'jotai';
import { filterAtom } from '@/atoms';
import { requestTemplate } from '@/utils';
import { QueryProvider, useCarouselSetPage, useCarouselSetSize } from '@/hooks';
import {
  CodeEditor,
  DataFrame,
  PaginationBar,
  ImageCarousel,
} from '@/components';

const meta: Meta<typeof CodeEditor> = {
  title: 'UX-SDK/CodeEditor',
  component: CodeEditor,
};
export default meta;

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

const Template = (args: any) => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    const setFilter = useSetAtom(filterAtom);

    useEffect(() => {
      setFilter({
        choice: 'byDataframe',
        value: {
          header: [],
          data: [],
          selected: [],
        },
      });
    }, []);

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <>
        <CodeEditor
          onCodeRun={runCode}
          onSuccessCallback={({
            header,
            data,
          }: {
            header: string[];
            data: any[][];
          }) =>
            setFilter({
              choice: 'byDataframe',
              value: {
                header,
                data,
                selected: Array(data.length).fill(false),
              },
            })
          }
          {...args.CodeEditor}
        />
        <DataFrame {...args.DataFrame} />
        <PaginationBar />
        <ImageCarousel />
      </>
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
      initCode: code,
      placeholder: 'write pandas dataframe query here',
    },
    DataFrame: {
      title: 'Query Result',
    },
  },
};
