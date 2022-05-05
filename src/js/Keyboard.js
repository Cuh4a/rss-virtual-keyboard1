/* eslint-disable import/extensions */
import create from './utils/create.js';
import language from './languages/lang.js';
import Key from './Key.js';
// import { get } from './localStorage.js';

const main = create('main', 'main');
const wrapper = create('div', 'wrapper', [
  create('h1', 'title', 'Virtual Keyboard'),
]);

export default class Keyboard {
  constructor(rows) {
    this.rows = rows;
    this.pressed = {};
  }

  init(lang) {
    this.buttonsAll = language[lang];
    this.text = create(
      'textarea',
      'text',
      null,
      wrapper,
      ['cols', 50],
      ['rows', 5],
      ['placeholder', 'Type something here...'],
      ['autocorrect', 'off'],
      ['spellcheck', false],
      ['autofocus', true],
    );
    this.container = create('div', 'keyboard', null, wrapper, [
      'language',
      lang,
    ]);
    document.body.append(main);
    main.append(wrapper);
    return this;
  }

  makeButtons() {
    this.keyButtons = [];
    this.rows.forEach((element, index) => {
      const rowButton = create('div', 'row-button', null, this.container, [
        'number',
        index + 1,
      ]);
      element.forEach((e) => {
        const buttonObj = this.buttonsAll.find((key) => key.code === e);
        const button = new Key(buttonObj);
        this.keyButtons.push(button);
        rowButton.append(button.div);
      });
    });
  }
}
