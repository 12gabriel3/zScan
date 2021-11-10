import { Route, Switch } from 'react-router';
import { HashRouter } from 'react-router-dom';

import MainWindow from './MainWindow';
import Tooltip from './TooltipWindow';

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" component={MainWindow} />
        <Route path="/tooltip" component={Tooltip} />
      </Switch>
    </HashRouter>
  );
}
