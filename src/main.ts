import './style.css';

import { ConsoleDash } from './components/console';
import { ConstDash } from './components/const';
import { ForDash } from './components/for';
import { IfDash } from './components/if';
import { ScopeDash } from './components/scope';
import { scopeRegistry } from './scopeRegistry';

const globalScope = scopeRegistry.createAndAdd('global', null);
export { globalScope };

customElements.define('scope-', ScopeDash);
customElements.define('const-', ConstDash);
customElements.define('if-', IfDash);
customElements.define('for-', ForDash);
customElements.define('console-', ConsoleDash);
