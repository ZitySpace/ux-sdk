import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { QueryProvider } from '@/hooks';
import { useJotaiCarouselSetSize, useJotaiCarouselSetPage } from '@/atoms';
import { JotaiComparer, JotaiImageTag } from '@/components';

const meta: Meta<typeof JotaiComparer> = {
  title: 'UX-SDK/JotaiComparer',
  component: JotaiComparer,
};
export default meta;

const factory =
  (Component: React.FC<any>, params: any) =>
  ({ name }: { name: string }) => {
    return <Component name={name} {...params} />;
  };

const Template = (args: any) => {
  const Story = () => {
    const { isLoading: isSizeLoading } = useJotaiCarouselSetSize();
    const { isLoading: isPageLoading } = useJotaiCarouselSetPage();

    if (isSizeLoading || isPageLoading) return <></>;

    return <JotaiComparer Components={args.Components} />;
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
    Components: [JotaiImageTag, JotaiImageTag].map((c) => factory(c, {})),
  },
};
