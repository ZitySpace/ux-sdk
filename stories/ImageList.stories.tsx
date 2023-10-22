import React, { useEffect } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ImageList } from '@/components';
import { QueryProvider, useCarouselSetPage } from '@/hooks';
import { apiEndpointAtom } from '@/atoms';
import { Provider, useSetAtom } from 'jotai';

const meta: Meta<typeof ImageList> = {
  title: 'UX-SDK/ImageList',
  component: ImageList,
};
export default meta;

const Template = () => {
  const Story = () => {
    const { isLoading: isPageLoading } = useCarouselSetPage();

    const setApiEndpoint = useSetAtom(apiEndpointAtom);

    useEffect(() => {
      setApiEndpoint(`/formula-serv/zityspace/image-carousel/default`);
    }, []);

    if (isPageLoading) return <></>;

    return <ImageList />;
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
