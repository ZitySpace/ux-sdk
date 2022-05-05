import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import CodeEditor from './CodeEditor';
import { requestTemplate } from '../../utils/apis';
import DataFrame from '../DataFrame';
import PaginationBar from '../PaginationBar';
import { usePagingStore } from '../../stores/pagingStore';
import { useDataframeStore } from '../../stores/dataframeStore';
import { useDataframeHooks } from '../../utils/hooks/useDataframeHooks';

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
  const pagingStore = usePagingStore(args.DataFrame.pagingStoreName);
  const dataframeStore = useDataframeStore(args.DataFrame.dataframeStoreName);

  const { setDataframe } = useDataframeHooks({
    dataframeStore: dataframeStore,
  });

  return (
    <>
      <CodeEditor
        onCodeRun={runCode}
        onSuccessCallback={setDataframe}
        {...args.CodeEditor}
      />
      <DataFrame {...args.DataFrame} />
      <PaginationBar pagingStoreName={args.DataFrame.pagingStoreName} />
    </>
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
};
