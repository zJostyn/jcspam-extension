//const submitUrl = 'https://jcspam.vercel.app/submit';
const submitUrl = 'http://localhost:5000/submit';

chrome.storage.local.get(['isJCSpamEnabled']).then((result) => {
  injectDiv(result.isJCSpamEnabled);

  if (result.isJCSpamEnabled) {
    enableJCSpam();
  }
});

function injectDiv(isJCSpamEnabled) {
  if (location.pathname.startsWith('/_submit')) {
    return;
  }

  const div = document.createElement('div');
  div.id = 'jcspam-div';
  div.textContent = isJCSpamEnabled ? 'JCSpam Activado' : 'JCSpam Desactivado';
  div.style.width = '220px';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = isJCSpamEnabled;
  input.style.display = 'none';
  input.onchange = async (e) => {
    await chrome.storage.local.set({ isJCSpamEnabled: e.target.checked });
    location.reload();
  };

  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('icon_128.png');
  img.style.position = 'relative';
  img.style.cursor = 'pointer';
  img.style.left = input.checked ? '-2px' : '10px';
  img.style.width = '50px';
  img.style.height = '50px';
  img.style.borderRadius = '5px';
  img.onclick = async () => {
    input.checked = !input.checked;
    await chrome.storage.local.set({ isJCSpamEnabled: input.checked });
    div.textContent = input.checked ? 'JCSpam Activado' : 'JCSpam Desactivado';
    img.style.left = input.checked ? '-2px' : '10px';
    div.prepend(img);
    location.reload();
  }
  document.documentElement.append(div);
  div.prepend(input);
  div.prepend(img);
}

function enableJCSpam() {
  let submitButton = document.querySelector(
    // these used to be the selectors for the submit button, keep here for reference
    // maybe what can be done is to query button element with text 'Submit'
    // '.freebirdFormviewerViewNavigationSubmitButton'
    // '.uArJ5e.UQuaGc.Y5sE8d.VkkpIf.NqnGTe'
    '.uArJ5e.UQuaGc.Y5sE8d.VkkpIf'
  );

  if (submitButton) {
    const form = document.querySelector('form');

    submitButton.onclick = () => {
      const formUrl = form.action;
      form.method = 'POST';
      form.action = submitUrl;

      const counter = +prompt('Cuantas veces quieres que se envie el formulario?');
      if (!counter) {
        alert('Ingrese la cantidad deseada');
        return;
      }
      submitForm(formUrl, counter);
    };
  }
}

function submitForm(formUrl, submitNumber) {
  const url = document.createElement('input');
  url.type = 'hidden';
  url.setAttribute('name', 'url');
  url.value = formUrl;

  const form = document.querySelector('form');
  form.appendChild(url);

  const counter = document.createElement('input');
  counter.type = 'hidden';
  counter.setAttribute('name', 'counter');
  counter.value = submitNumber;
  form.appendChild(counter);

  const fromExtension = document.createElement('input');
  fromExtension.type = 'hidden';
  fromExtension.setAttribute('name', 'fromExtension');
  fromExtension.value = true;
  form.appendChild(fromExtension);

  form.submit();
}
