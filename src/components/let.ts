import { Declaration } from './declaration';

export class LetDash extends Declaration {
  static getTagName = () => 'let' as const;

  constructor() {
    super(LetDash.getTagName());
  }
}
