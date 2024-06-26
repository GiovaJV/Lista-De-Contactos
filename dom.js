const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z ]*$/;
const NUMBER_REGEX = /^[0](412|212|424|426|414|416)[0-9]{7}$/;

const nameInput = document.querySelector('#input-name');
const numberInput = document.querySelector('#input-number');
const formBtn = document.querySelector('#form-btn');
const form = document.querySelector('#form');
const list = document.querySelector('#list');

// Validations
let nameValidation = false;
let numberValidation = false;

// Functions
const validateInput = (input, validation) => {
  const infoText = input.parentElement.children[2];
  if (input.value === '') {
    input.classList.remove('incorrect');
    input.classList.remove('correct');
    input.classList.remove('fa-times-circle');
    infoText.classList.remove('show');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    input.classList.remove('fa-times-circle');
    input.classList.add('fa-check-circle');
    infoText.classList.remove('show');
  } else {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    input.classList.remove('fa-check-circle');
    input.classList.add(fa-times-circle);
    infoText.classList.add('show');
  }

  if (nameValidation && numberValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}

const renderContacts = () => {
  list.innerHTML = '';
  contacts.forEach(contact => {
    const li = document.createElement('li');
    li.classList.add('contact');
    li.id = contact.id;
    li.innerHTML = `
      <button class="delete-btn">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="delete-icon"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>               
      </button>
      <p>${contact.name}</p>
      <p>${contact.number}</p>
      <button class="edit-btn">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      </button>
    `;
    list.append(li)
  });
}

// Data
let contacts = [];

nameInput.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(nameInput.value);
  validateInput(nameInput, nameValidation);
});

numberInput.addEventListener('input', e => {
  numberValidation = NUMBER_REGEX.test(numberInput.value);
  validateInput(numberInput, numberValidation);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  // Verificar si las validaciones son verdaderas
  if (!nameValidation || !numberValidation) return;
  // Crear contacto
  const newContact = {
    id: crypto.randomUUID(),
    name: nameInput.value,
    number: numberInput.value,
  }
  // Agregar el contacto al array
  contacts = contacts.concat(newContact);
  // Guardar en el navegador
  localStorage.setItem('contacts', JSON.stringify(contacts));

  renderContacts();
});

list.addEventListener('click', e => {
  const deleteBtn = e.target.closest('.delete-btn');
  const editBtn = e.target.closest('.edit-btn');
  // Eliminar
  if (deleteBtn) {
    const id = deleteBtn.parentElement.id;
    contacts = contacts.filter(contact => {
      if (contact.id !== id) {
        return contact;
      }
    });
    localStorage.setItem('contacts', JSON.stringify(contacts));
    renderContacts();
  }

  // Editar
  if (editBtn) {
    const li = editBtn.parentElement;
    const nameEdit = li.children[1];
    const numberEdit = li.children[2];
    let editNameValidation = NAME_REGEX.test(nameEdit.textContent);
    let editNumberValidation = NUMBER_REGEX.test(numberEdit.textContent);

    nameEdit.addEventListener("input", (e) => {
        editNameValidation = NAME_REGEX.test(nameEdit.textContent);
        validateInput(nameEdit, editNameValidation);
    });

    numberEdit.addEventListener("input", (e) => {
        editNumberValidation = NUMBER_REGEX.test(numberEdit.textContent);
        validateInput(numberEdit, editNumberValidation);
    });

    if (li.classList.contains("editando")) {
        if (editNameValidation && editNumberValidation) {
            li.classList.remove("editando");
            nameEdit.removeAttribute("contenteditable");
            numberEdit.removeAttribute("contenteditable");
            editBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>
`;
            contacts = contacts.map((contact) => {
                if (contact.id === li.id) {
                    return {
                        ...contact,
                        name: nameEdit.innerHTML,
                        number: numberEdit.innerHTML,
                    };
                } else {
                    return contact;
                }
            });
            localStorage.setItem("contacts", JSON.stringify(contacts));
            renderContacts();
        }
    } else {
        li.classList.add("editando");
        nameEdit.setAttribute("contenteditable", true);
        numberEdit.setAttribute("contenteditable", true);
        editBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>
`;
    }
}
});


(() => {
  const contactsLocal = localStorage.getItem('contacts');
  if (contactsLocal) {
    const contactsArray = JSON.parse(contactsLocal);
    contacts = contactsArray;
    renderContacts();
  }
})();