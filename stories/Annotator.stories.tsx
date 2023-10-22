import React, { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { QueryProvider, useCarouselSetSize, useCarouselSetPage } from '@/hooks';
import { Annotator } from '@/components';
import { apiEndpointAtom } from '@/atoms';
import { Provider, useSetAtom } from 'jotai';

const meta: Meta<typeof Annotator> = {
  title: 'UX-SDK/Annotator',
  component: Annotator,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    const setApiEndpoint = useSetAtom(apiEndpointAtom);

    useEffect(() => {
      setApiEndpoint(`/formula-serv/zityspace/image-carousel/default`);
    }, []);

    if (isSizeLoading || isPageLoading) return <></>;

    return (
      <div style={{ height: 540 }}>
        <Annotator />
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
  render: () => <Template />,
  args: {},
};
