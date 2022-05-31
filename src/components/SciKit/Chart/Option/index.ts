import { Base } from './Base';
import { Bar } from './Bar';

export class Option extends Base {
  public static makeBar = () => new Bar();
}
