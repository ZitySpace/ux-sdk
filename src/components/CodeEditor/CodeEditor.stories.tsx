import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import CodeEditor from './CodeEditor';
import { requestTemplate } from '../../utils/apis';

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

const Template: ComponentStory<typeof CodeEditor> = (args) => {
  return (
    <CodeEditor
      title='DataFrame Query Box'
      initCode={code}
      placeholder='write pandas dataframe query here'
      onCodeRun={runCode}
    />
  );
};

export const Story = Template.bind({});
Story.args = {};
