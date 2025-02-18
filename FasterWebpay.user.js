// ==UserScript==
// @name        Faster Webpay
// @version     1
// @author      zzdroide
// @homepageURL https://github.com/zzdroide/FasterWebpay
// @match       https://webpay3g.transbank.cl/webpayserver/*
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @top-level-await
// ==/UserScript==

// The following two functions with `new Promise` omit catch and reject on purpose,
// to make code more readable.

/** Waits for an element to exist. */
const waitFor = (elementId) => new Promise((resolve) => {
  VM.observe(document.body, () => {
    if (!document.getElementById(elementId)) return false;

    resolve();
    return true;  // disconnect observer
  });
});

/** Waits until an input element has been filled with as many characters as sampleText. */
const inputFilled = (inputId, sampleText) => new Promise((resolve) => {
  const input = document.getElementById(inputId);
  const len = sampleText.length;
  input.addEventListener('input', onInput);

  function onInput({ target: { value } }) {
    if (value.length >= len) {
      input.removeEventListener('input', onInput);
      resolve();
    }
  }
});


// Wait for ui elements to appear
await waitFor('tarjetas');

// Auto-click "Tarjetas" so you don't have to choose it instead of Onepay:
document.getElementById('tarjetas').click();

// Auto-focus the input you want:
document.getElementById('card-number').focus();

// and wait for it to be filled:
await inputFilled('card-number', 'xxxx xxxx xxxx xxxx');

// This is the same as clicking "Continuar"?
// They wanted `oninput` but used `onchange` instead?
document.getElementById('card-number').blur();

// Wait for next inputs to appear:
await waitFor('card-exp');

// Auto-focus the next input you want:
document.getElementById('card-exp').focus();

// Wait for it to be filled:
await inputFilled('card-exp', 'xx/xx');

// Usually you press <tab> to go to the next input.
// But on an often used form, this shouldn't be requiered:
document.getElementById('card-cvv').focus();

// Wait for it to be filled:
await inputFilled('card-cvv', '123');

// Usually you would check form data before submitting,
// but just submit as automatically as possible:
document.querySelector('button.submit').click();
