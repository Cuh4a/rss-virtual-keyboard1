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
      'Use Ctrl + Alt to switch language',
      wrapper,
    );
    wrapper.append(hint);
    const os = create('h2', 'os', 'Keyboard was created in Windows', wrapper);
    wrapper.append(os);
    return this;
  }

  makeButtons() {
    this.counter = 1;
    this.capsLockCounter = 0;
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
        if (button.isFnKey) {
          button.div.classList.add('fn');
        }
        if (button.code.match(/MetaLeft|ArrowDown/)) {
          button.div.classList.add('pink');
        }
        if (button.code.match(/ArrowLeft|ArrowUp|ArrowRight/)) {
          button.div.classList.add('blue');
        }
      });
    });
    document.onkeydown = this.handle;
    document.onkeyup = this.handle;
    document.onmousedown = this.handle;
    document.onmouseup = this.handle;
  }

  handle = (e) => {
    const { code, type } = e;
    if (e.stopPropogation) e.stopPropogation();
    const actualButton = this.keyButtons.find((key) => key.code === code);
    this.text.focus();
    if (actualButton === undefined) {
      return;
    }
    if (type.match(/keydown|mousedown/)) {
      if (type.match(/keydown/)) e.preventDefault();
      actualButton.div.classList.add('active');

      if (code.match(/Control/)) this.isCtrl = true;
      if (code.match(/Alt/)) this.isAlt = true;

      if (code.match(/Control/) && this.isAlt) this.languageChange();
      if (code.match(/Alt/) && this.isCtrl) this.languageChange();

      if (code.match(/Shift/)) {
        this.isShift = true;
        this.lettersUp();
      }

      if (code.match(/CapsLock/)) {
        this.isCapsLock = true;
        if (this.capsLockCounter === 0) {
          this.capsLockCounter += 1;
          actualButton.div.classList.add('active');
          this.lettersUp();
        } else if (this.capsLockCounter === 1) {
          this.capsLockCounter += 1;
          actualButton.div.classList.remove('active');
          this.capsLockCounter = 0;
          this.isCapsLock = false;
          this.lettersUp();
        }
      }
    } else if (type.match(/keyup|mouseup/)) {
      actualButton.div.classList.remove('active');
      if (code.match(/Control/)) {
        this.counter = 1;
        this.isCtrl = false;
      }
      if (code.match(/Alt/)) {
        this.counter = 1;
        this.isAlt = false;
      }
      if (code.match(/Shift/)) {
        this.isShift = false;
        this.lettersUp();
      }
      if (code.match(/CapsLock/)) {
        if (this.capsLockCounter === 1) {
          actualButton.div.classList.add('active');
        } else if (this.capsLockCounter === 2) {
          this.isCapsLock = false;
          actualButton.div.classList.remove('active');
          this.lettersUp();
        }
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

  lettersUp = () => {
    if (this.isShift) {
      if (!this.isCapsLock) {
        this.keyButtons.forEach((e) => {
          if (!e.isFnKey) {
            e.extra.classList.remove('hidden');
            e.letter.classList.add('hidden');
          }
        });
      } else if (this.isCapsLock) {
        this.keyButtons.forEach((e) => {
          if (!e.isFnKey && e.low.match(/[a-zа-я]/)) {
            e.extra.classList.add('hidden');
            e.letter.classList.remove('hidden');
          }
          if (!e.isFnKey && !e.low.match(/[a-zа-я]/)) {
            e.extra.classList.remove('hidden');
            e.letter.classList.add('hidden');
          }
        });
      }
    } else if (!this.isShift) {
      if (!this.isCapsLock) {
        this.keyButtons.forEach((e) => {
          if (!e.isFnKey) {
            e.extra.classList.add('hidden');
            e.letter.classList.remove('hidden');
          }
        });
      } else if (this.isCapsLock) {
        if (this.capsLockCounter === 1) {
          this.keyButtons.forEach((e) => {
            if (!e.isFnKey && e.low.match(/[a-zа-я]/)) {
              e.extra.classList.remove('hidden');
              e.letter.classList.add('hidden');
            }
            if (!e.isFnKey && !e.low.match(/[a-zа-я]/)) {
              e.extra.classList.add('hidden');
              e.letter.classList.remove('hidden');
            }
          });
        } else if (this.capsLockCounter === 2) {
          this.keyButtons.forEach((e) => {
            if (!e.isFnKey && e.low.match(/[a-zа-я]/)) {
              e.extra.classList.add('hidden');
              e.letter.classList.remove('hidden');
              this.capsLockCounter = 0;
            }
          });
        }
      }
    }
  };
}
