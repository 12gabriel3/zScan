import { Prop } from './renderer';
import Wrapper from './Wrapper';

export default function Rows({ children }: Prop) {
  return <Wrapper create="rows">{children}</Wrapper>;
}
