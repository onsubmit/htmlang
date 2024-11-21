import './style.css';

import { ConsoleDash } from './components/console';
import { ForDash } from './components/for';
import { IfDash } from './components/if';

customElements.define('if-', IfDash);
customElements.define('for-', ForDash);
customElements.define('console-', ConsoleDash);
