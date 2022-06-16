import { Base } from './Base';
import { Bar } from './Bar';
import { Pie } from './Pie';
import { Scatter } from './Scatter';
import { Heatmap } from './Heatmap';
import { Line } from './Line';
import { Tree } from './Tree';
import { Treemap } from './Treemap';
import { Sunburst } from './Sunburst';
import { Sankey } from './Sankey';
import { Scatter3D } from './Scatter3D';

export class Option extends Base {
  public static makeBase = () => new Base();
  public static makeBar = () => new Bar();
  public static makePie = () => new Pie();
  public static makeScatter = () => new Scatter();
  public static makeHeatmap = () => new Heatmap();
  public static makeLine = () => new Line();
  public static makeTree = () => new Tree();
  public static makeTreemap = () => new Treemap();
  public static makeSunburst = () => new Sunburst();
  public static makeSankey = () => new Sankey();
  public static makeScatter3D = () => new Scatter3D();
}
