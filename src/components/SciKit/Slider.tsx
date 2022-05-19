import React, {
  forwardRef,
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import SliderRc from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import type { SliderProps } from 'rc-slider';
import raf from 'rc-util/lib/raf';
import Tooltip from 'rc-tooltip';

const HandleTooltip = (props: {
  value: number;
  children: React.ReactElement;
  visible: boolean;
  tipFormatter?: (value: number) => React.ReactNode;
}) => {
  const {
    value,
    children,
    visible,
    tipFormatter = (val) => `${val}`,
    ...restProps
  } = props;

  const tooltipRef = React.useRef<any>();
  const rafRef = React.useRef<number | null>(null);

  function cancelKeepAlign() {
    raf.cancel(rafRef.current!);
  }

  function keepAlign() {
    rafRef.current = raf(() => {
      tooltipRef.current?.forcePopupAlign();
    });
  }

  React.useEffect(() => {
    if (visible) {
      keepAlign();
    } else {
      cancelKeepAlign();
    }

    return cancelKeepAlign;
  }, [value, visible]);

  return (
    <Tooltip
      placement='top'
      overlay={tipFormatter(value)}
      overlayInnerStyle={{ minHeight: 'auto' }}
      ref={tooltipRef}
      visible={visible}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

const handleRender: SliderProps['handleRender'] = (node, props) => {
  return (
    <HandleTooltip value={props.value} visible={props.dragging}>
      {node}
    </HandleTooltip>
  );
};

// to customize tooltip: e.g. add percentage % after value
// <TooltipSliderRc tipFormatter={(value) => `${value} %`/>
const TooltipSliderRc = ({
  tipFormatter,
  tipProps,
  ...props
}: SliderProps & {
  tipFormatter?: (value: number) => React.ReactNode;
  tipProps: any;
}) => {
  const tipHandleRender: SliderProps['handleRender'] = (node, handleProps) => {
    return (
      <HandleTooltip
        value={handleProps.value}
        visible={handleProps.dragging}
        tipFormatter={tipFormatter}
        {...tipProps}
      >
        {node}
      </HandleTooltip>
    );
  };

  return <SliderRc {...props} handleRender={tipHandleRender} />;
};

const Slider = forwardRef(
  (
    {
      name,
      defaultValue,
      range = [0, 1],
      breakpoints = [],
      step = null,
      asRange = false,
      reverse = false,
      discrete = false,
      reactiveCallback = undefined,
    }: {
      name: string;
      defaultValue: number | number[];
      range?: number[];
      breakpoints?: number[];
      step?: number | null;
      asRange?: boolean;
      reverse?: boolean;
      discrete?: boolean;
      reactiveCallback?: () => unknown;
    },
    ref
  ) => {
    const marks = [
      ...breakpoints,
      ...range,
      ...(Array.isArray(defaultValue) ? defaultValue : [defaultValue]),
    ].reduce((m, b) => ({ ...m, [b]: b }), {});

    const stepFinal = step !== null ? step : (range[1] - range[0]) / 100;

    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
      reactiveCallback && reactiveCallback();
    }, [value]);

    useImperativeHandle(ref, () => ({
      getValue: () => value,
      reset: () => setValue(defaultValue),
    }));

    return (
      <div className='flex items-center justify-start pb-2'>
        <div className='w-28 mr-3 relative h-7'>
          <div className='text-right absolute right-0'>
            <span className='text-sm font-medium text-gray-700'>{name}</span>
          </div>
        </div>

        <div className='pl-1 w-52'>
          {asRange ? (
            <SliderRc
              range
              min={range[0]}
              max={range[1]}
              defaultValue={defaultValue}
              value={value}
              allowCross={false}
              marks={marks}
              step={discrete ? null : stepFinal}
              trackStyle={{ backgroundColor: '#818cf8' }}
              handleStyle={{
                borderColor: '#818cf8',
                backgroundColor: '#818cf8',
                opacity: 1,
              }}
              railStyle={{ backgroundColor: '#d1d5db' }}
              dotStyle={{ borderColor: '#d1d5db' }}
              activeDotStyle={{
                borderColor: '#818cf8',
              }}
              handleRender={handleRender}
              onChange={(v) => setValue(v)}
            />
          ) : (
            <SliderRc
              min={range[0]}
              max={range[1]}
              defaultValue={defaultValue}
              value={value}
              marks={marks}
              step={discrete ? null : stepFinal}
              reverse={reverse}
              trackStyle={{ backgroundColor: '#818cf8' }}
              handleStyle={{
                borderColor: '#818cf8',
                backgroundColor: '#818cf8',
                opacity: 1,
              }}
              railStyle={{ backgroundColor: '#d1d5db' }}
              dotStyle={{ borderColor: '#d1d5db' }}
              activeDotStyle={{
                borderColor: '#818cf8',
              }}
              handleRender={handleRender}
              onChange={(v) => setValue(v)}
            />
          )}
        </div>
      </div>
    );
  }
);

export default Slider;
