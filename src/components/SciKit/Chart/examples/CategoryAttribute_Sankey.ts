import { FilteringProps } from '../../../../stores/contextStore';
import { Option } from '../Option';
import { MouseEventParams, fetchData } from '../Option/Base';

export const makeOption = (
  HOST: string,
  setFiltering: { (filteringProps: FilteringProps): void }
) =>
  Option.makeSankey()
    .setSize({ height: 640 })
    .setSankeyData(
      async () => await fetchData(HOST + '/relation?name=category-attributes')
    )
    .updateOption({
      series: [
        {
          name: 'CategoryAttributeSankey',
          orient: 'vertical',
          top: '15%',
          bottom: '15%',
          left: '2%',
          right: '2%',
          lineStyle: {
            color: 'source',
            opacity: 0.6,
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                color: '#fbb4ae',
              },
              label: {
                position: 'top',
                align: 'left',
                rotate: 60,
              },
            },
            {
              depth: 1,
              itemStyle: {
                color: '#b3cde3',
              },
              label: {
                position: 'top',
                align: 'left',
                rotate: 60,
              },
            },
            {
              depth: 2,
              itemStyle: {
                color: '#ccebc5',
              },
              label: {
                position: 'top',
                align: 'left',
                rotate: 60,
              },
            },
            {
              depth: 3,
              itemStyle: {
                color: '#decbe4',
              },
              label: {
                position: 'bottom',
                align: 'left',
                rotate: 300,
              },
            },
          ],
        },
      ],
    });
