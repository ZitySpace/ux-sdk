import { Base } from './Base';
import { Bar } from './Bar';
import { Pie } from './Pie';
import { Scatter } from './Scatter';

export class Option extends Base {
  public static makeBar = () => new Bar();
  public static makePie = () => new Pie();
  public static makeScatter = () => new Scatter();
}
