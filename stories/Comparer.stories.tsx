import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryProvider, useCarouselSetSize, useCarouselSetPage } from '@/hooks';
import { Comparer, ImageTag } from '@/components';

const meta: Meta<typeof Comparer> = {
  title: 'UX-SDK/Comparer',
  component: Comparer,
};
export default meta;

const factory =
  (Component: React.FC<any>, params: any) =>
  ({ name }: { name: string }) => {
    return <Component name={name} {...params} />;
  };

const Template = (args: any) => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useCarouselSetSize();
    const { isLoading: isPageLoading } = useCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return <Comparer Components={args.Components} />;
  };

  return (
    <QueryProvider>
      <Story />
    </QueryProvider>
  );
};

export const Story: StoryObj<typeof Template> = {
  render: (args) => <Template {...args} />,
  args: {
    Components: [ImageTag, ImageTag].map((c) => factory(c, {})),
  },
};
