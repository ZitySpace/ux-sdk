import { FilterProps } from '@/atoms';
import { Option, MouseEventParams } from '@/components';
import { fetchData } from '@/utils';

export const makeOption = (
  HOST: string,
  setFilter: { (filter: FilterProps): void }
) =>
  Option.makeSankey()
    .setSize({ height: 640 })
    .setSankeyData(
      async () => await fetchData(HOST + '/relation?name=categories-attributes')
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
          nodeGap: 16,
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
    })
    .setBackgroundAction({
      name: 'click',
      action: async () => {
        setFilter(
          await Option.filterFromQuery(
            HOST,
            "res = df[['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]"
          )
        );
      },
    })
    .addElementAction({
      name: 'click',
      query: 'series',
      action: async (params: MouseEventParams, chart: echarts.ECharts) => {
        const data: any = params.data;
        const nodes = (chart.getOption() as any).series[params.seriesIndex]
          .nodes;
        const links = (chart.getOption() as any).series[params.seriesIndex]
          .links;

        let queryStr = '';

        if (params.dataType === 'edge') {
          // clicked link

          if (data.type === 'cate') {
            const cate = nodes
              .find((n: any) => n.name === data.target)
              .orig_path.split('.')
              .pop();
            queryStr = `
res = df[df.category == '${cate}'][['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]
            `;
          } else if (data.type === 'attr') {
            const attrNode = nodes.find((n: any) => n.name === data.target);
            queryStr = `
global check
def check(path, anno):
    names = path.split('.')

    cur = anno
    while names:
        name = names.pop(0)
        if isinstance(cur, str):
            if not names and (name == cur or name in cur.split(';')):
                return True
            return False

        if name not in cur:
            return False

        cur = anno[name]

    return True

slice = df[df.attributes.apply(lambda x: check('${attrNode.orig_path}', ast.literal_eval(x)))]

res = slice[['image_hash', 'x', 'y', 'w', 'h', 'type']]
            `;
          } else if (data.type === 'cate_attr') {
            const cate = nodes
              .find((n: any) => n.name === data.source)
              .orig_path.split('.')
              .pop();
            const attr = nodes
              .find((n: any) => n.name === data.target)
              .orig_path.split('.')
              .pop();
            queryStr = `
slice = df[df[['category', 'attributes']].apply(
    lambda r: r['category'] == '${cate}' and '${attr}' in ast.literal_eval(r['attributes']),
    axis=1
)]

res = slice[['image_hash', 'x', 'y', 'w', 'h', 'type']]
            `;
          }
        } else if (params.dataType === 'node') {
          // clicked node

          if (data.type === 'cate') {
            const cates = data.orig_path.includes('.')
              ? [data.orig_path.split('.').pop()]
              : links
                  .filter((l: any) => l.source === data.name)
                  .map((l: any) =>
                    nodes
                      .find((n: any) => n.name === l.target)
                      .orig_path.split('.')
                      .pop()
                  );

            queryStr = `
global cates
cates = ${JSON.stringify(cates)}
res = df[df.category.isin(cates)][['image_hash', 'x', 'y', 'w', 'h', 'category', 'type']]
            `;
          } else if (data.type === 'attr') {
            queryStr = `
global check
def check(path, anno):
    names = path.split('.')

    cur = anno
    while names:
        name = names.pop(0)
        if isinstance(cur, str):
            if not names and (name == cur or name in cur.split(';')):
                return True
            return False

        if name not in cur:
            return False

        cur = anno[name]

    return True

slice = df[df.attributes.apply(lambda x: check('${data.orig_path}', ast.literal_eval(x)))]

res = slice[['image_hash', 'x', 'y', 'w', 'h', 'type']]
            `;
          }
        }

        setFilter(await Option.filterFromQuery(HOST, queryStr));
      },
    });
