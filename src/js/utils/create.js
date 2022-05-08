export default function create(el, names, child, parent, ...dataAtr) {
  let element = null;
  if (el) {
    element = document.createElement(el);
  }

  if (names) {
    element.classList.add(...names.split(' '));
  }

  if (child && Array.isArray(child)) {
    child.forEach((e) => e && element.append(e));
  } else if (
    (child && typeof child === 'object') ||
    (child && typeof child === 'string')
  ) {
    element.append(child);
  }

  if (parent) {
    parent.append(element);
  }

  if (dataAtr.length !== 0) {
    dataAtr.forEach(([atrKey, atrValue]) => {
      if (atrValue === '') {
        element.setAttribute(atrKey, '');
      }
      if (
        atrKey.match(
          /value|id|placeholder|cols|rows|autocorrect|spellcheck|autofocus|resize/,
        )
      ) {
        element.setAttribute(atrKey, atrValue);
      } else {
        element.dataset[atrKey] = atrValue;
      }
    });
  }
  return element;
}
