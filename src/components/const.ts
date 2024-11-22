import { Declaration } from './declaration';

export class ConstDash extends Declaration {
  static getTagName = () => 'const' as const;

  constructor() {
    super(ConstDash.getTagName());
  }
}
