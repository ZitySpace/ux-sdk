import { Base } from './Base';
import { Bar } from './Bar';
import { Pie } from './Pie';

export class Option extends Base {
  public static makeBar = () => new Bar();
  public static makePie = () => new Pie();
}
