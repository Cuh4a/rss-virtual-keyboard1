/* eslint-disable import/extensions */
import create from './utils/create.js';

export default class Key {
  constructor({ code, low, up }) {
    this.code = code;
    this.low = low;
    this.up = up;
    this.isFnKey = Boolean(
      low.match(
        /Tab|CapsLock|Shift|Ctrl|Win|Alt|Space|Backspace|Del|Enter|arr/,
      ),
    );
    this.extra = create('div', 'extra', this.up);
    this.letter = create('div', 'letter', this.low);
    this.div = create('div', 'key', [this.extra, this.letter], null, [
      'code',
      this.code,
    ]);
  }
}
