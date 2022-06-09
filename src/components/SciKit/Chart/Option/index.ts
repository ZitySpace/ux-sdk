import { Base } from './Base';
import { Bar } from './Bar';
import { Pie } from './Pie';
import { Scatter } from './Scatter';
import { Heatmap } from './Heatmap';
import { Line } from './Line';
import { Tree } from './Tree';

export class Option extends Base {
  public static makeBase = () => new Base();
  public static makeBar = () => new Bar();
  public static makePie = () => new Pie();
  public static makeScatter = () => new Scatter();
  public static makeHeatmap = () => new Heatmap();
  public static makeLine = () => new Line();
  public static makeTree = () => new Tree();
}
