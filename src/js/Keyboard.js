import create from './utils/create';
import language from './languages/lang';
import Key from './Key';
import * as storage from './localStorage';

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
    const hint = create(
      'span',
      'hint',
      'Use Shift + Ctrl to switch language',
      wrapper,
    );
    wrapper.append(hint);
    const os = create('h2', 'os', 'Keyboard was created in Windows', wrapper);
    wrapper.append(os);
    return this;
  }

  makeButtons() {
    this.counter = 1;
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
        if (button.code.match(/Backspace|CapsLock|ShiftLeft/)) {
          button.div.style.width = '100px';
        } else if (button.code.match(/Space/)) {
          button.div.style.width = '330px';
        } else if (button.code.match(/Enter|ShiftRight/)) {
          button.div.style.width = '86px';
        } else if (button.code.match(/Tab|Del/)) {
          button.div.style.width = '47px';
        }
      });
    });
    document.onkeydown = this.handle;
    document.onkeyup = this.handle;
  }

  handle = (e) => {
    const { code, type } = e;
    if (e.stopPropogation) e.stopPropogation();
    const actualButton = this.keyButtons.find((key) => key.code === code);
    this.text.focus();
    if (actualButton === undefined) {
      return;
    }
    if (type.match(/keydown/)) {
      e.preventDefault();
      actualButton.div.classList.add('active');
      if (e.code.match(/Control|ShiftLeft|CapsLock|Tab|Backquote|MetaLeft/)) {
        actualButton.div.style.backgroundColor = 'rgb(196, 176, 86)';
        actualButton.div.style.boxShadow = '0px 0 10px #719ece';
        actualButton.div.style.border = '3px solid rgb(200, 230, 255)';
      }
      if (code.match(/Control/)) this.isCtrl = true;
      if (code.match(/Shift/)) this.isShift = true;

      if (code.match(/Control/) && this.isShift) this.languageChange();
      if (code.match(/Shift/) && this.isCtrl) this.languageChange();
    } else if (type.match(/keyup/)) {
      actualButton.div.classList.remove('active');
      if (e.code.match(/Control|ShiftLeft|CapsLock|Tab|Backquote/)) {
        actualButton.div.style.backgroundColor = 'rgba(33, 89, 156, 0.4)';
        actualButton.div.style.boxShadow = '0px 0 3px #719ece';
        actualButton.div.style.border = '1px solid rgb(200, 230, 255)';
      } else if (e.code.match(/MetaLeft/)) {
        actualButton.div.style.backgroundColor = 'rgb(245, 132, 198)';
        actualButton.div.style.boxShadow = '0px 0 3px #719ece';
        actualButton.div.style.border = '1px solid rgb(200, 230, 255)';
      }
      if (code.match(/Control/)) {
        this.counter = 1;
        this.isCtrl = false;
      }
      if (code.match(/Shift/)) {
        this.counter = 1;
        this.isShift = false;
      }
    }
  };

  languageChange = () => {
    if (this.container.dataset.language === 'en' && this.counter === 1) {
      this.counter += 1;
      this.container.dataset.language = 'ru';
      storage.set('lang', this.container.dataset.language);
      this.buttonsAll = language.ru;
    } else if (this.container.dataset.language === 'ru' && this.counter === 1) {
      this.counter += 1;
      this.container.dataset.language = 'en';
      storage.set('lang', this.container.dataset.language);
      this.buttonsAll = language.en;
    }
    this.keyButtons.forEach((e) => {
      const newLangButton = this.buttonsAll.find((key) => key.code === e.code);
      e.low = newLangButton.low;
      e.letter.innerHTML = newLangButton.low;
      e.up = newLangButton.up;
      e.extra.innerHTML = newLangButton.up;
    });
  };
}
