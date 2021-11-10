import { Prop } from './renderer';
import Wrapper from './Wrapper';

export default function Columns({ children }: Prop) {
  return <Wrapper create="columns">{children}</Wrapper>;
}
