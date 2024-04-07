let keyId = Math.random() * 10000;
const EDIT = 'edit',
  ADD = 'add';

//bars animation

const bars = document.querySelectorAll('.bar');

const animateBars = () => {
  bars.forEach((bar) => bar.classList.toggle('active'));
};

document
  .querySelector('.navbar-toggler')
  .addEventListener('click', animateBars);

//data fetching

const fetchData = async (passedFunction, isHomePage) => {
  let response;
  if (isHomePage) response = await fetch('./places.json');
  else response = await fetch('../places.json');

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }

  const fetchedData = await response.json();

  passedFunction(fetchedData);
};

//generating places in homepage

const generateTrendingPlaces = (data) => {
  const container = document.querySelector('.trending-places');
  for (let i = 0; i < 4; i++) {
    const cart = document.createElement('div');
    cart.classList.add('cart');
    cart.setAttribute('id', data[i].id);
    const img = document.createElement('img');
    img.src = `./images/${data[i].image.src}`;
    img.alt = data[i].image.alt;
    const title = document.createElement('h3');
    title.textContent = data[i].title;
    const description = document.createElement('p');
    description.textContent = data[i].short_description;
    cart.appendChild(img);
    cart.appendChild(title);
    cart.appendChild(description);
    container.appendChild(cart);
  }
};

const initDate = () => {
  //set initial, min and max date for date inputs
  const date = new Date();
  const startDate = document.getElementById('start-date');
  startDate.valueAsDate = date;
  startDate.min = date.toISOString().split('T')[0];
  const endDate = document.getElementById('end-date');
  date.setDate(date.getDate() + 1);
  endDate.valueAsDate = date;
  endDate.min = date.toISOString().split('T')[0];
  date.setFullYear(date.getFullYear() + 1);
  endDate.max = date.toISOString().split('T')[0];
  const dateWarning = document.querySelector('.date-warning');

  //date validation
  const checkDate = () => {
    const startDateValue = new Date(startDate.value);
    const endDateValue = new Date(endDate.value);

    if (endDateValue <= startDateValue) dateWarning.classList.add('active');
    else dateWarning.classList.remove('active');
  };
  checkDate();
  startDate.addEventListener('change', checkDate);
  endDate.addEventListener('change', checkDate);
};

//add or edit place function

const addEditTrip = (key, type) => {
  let trip = '';

  const image = document.querySelector('.place img');
  const src = image.src;
  const alt = image.alt;
  const title = document.querySelector('.place h3').textContent;
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const email = document.getElementById('email').value;
  const startDate = document.getElementById('start-date').valueAsDate;
  const endDate = document.getElementById('end-date').valueAsDate;
  const guide = document.getElementById('yes').checked ? 'yes' : 'no';
  const friends = document.getElementById('friends-number').value;
  const transport = document.getElementById('transport').checked;
  const breakfasts = document.getElementById('breakfasts').checked;
  const dinners = document.getElementById('dinners').checked;
  const sauna = document.getElementById('sauna').checked;

  trip = {
    image: { src, alt },
    title,
    firstName,
    lastName,
    email,
    startDate,
    endDate,
    guide,
    friends,
    amenities: {
      transport,
      breakfasts,
      dinners,
      sauna,
    },
  };
  sessionStorage.setItem(key, JSON.stringify(trip));
  if (type === ADD) inputValuesReset();
};

//input values reset

const inputValuesReset = () => {
  document.getElementById('first-name').value = '';
  document.getElementById('last-name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('yes').checked = false;
  document.getElementById('no').checked = false;
  document.getElementById('friends-number').value = '';
  document
    .querySelectorAll('input[type="checkbox"]:checked')
    .forEach((input) => (input.checked = false));
  initDate();
};

const placeImageAndTitle = (imageSrc, imageAlt, title) => {
  const placeDiv = document.querySelector('.modal-form .place');
  placeDiv.innerHTML = '';
  const modalImage = document.createElement('img');
  modalImage.src = imageSrc;
  modalImage.alt = imageAlt;
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = title;
  placeDiv.appendChild(modalImage);
  placeDiv.appendChild(modalTitle);
};

//modal and form
const openForm = ({ title, image }) => {
  const modal = document.querySelector('.modal-form');
  inputValuesReset();
  placeImageAndTitle(`../images/${image.src}`, image.alt, title);

  initDate();
  modal.showModal();
};

const generateAvailablePlaces = (data) => {
  const container = document.querySelector('.places-container');
  for (let i = 0; i < data.length; i++) {
    const cart = document.createElement('div');
    cart.classList.add('cart');
    cart.setAttribute('id', data[i].id);
    const img = document.createElement('img');
    img.src = `../images/${data[i].image.src}`;
    img.alt = data[i].image.alt;
    const title = document.createElement('h3');
    title.textContent = data[i].title;
    const description = document.createElement('p');
    description.textContent = data[i].short_description;
    const button = document.createElement('button');
    button.textContent = 'Add to List';
    button.addEventListener('click', () => openForm(data[i]));
    cart.appendChild(img);
    cart.appendChild(title);
    cart.appendChild(description);
    cart.appendChild(button);
    container.appendChild(cart);
  }
};

const fillFormWithDate = (data, key) => {
  const form = document.querySelector('form');
  form.setAttribute('id', key);
  const firstName = document.getElementById('first-name');
  firstName.value = data.firstName;
  const lastName = document.getElementById('last-name');
  lastName.value = data.lastName;
  const email = document.getElementById('email');
  email.value = data.email;
  const startDate = document.getElementById('start-date');
  startDate.valueAsDate = new Date(data.startDate);
  const endDate = document.getElementById('end-date');
  endDate.valueAsDate = new Date(data.endDate);
  if (data.guide === 'yes') document.getElementById('yes').checked = true;
  else document.getElementById('no').checked = true;

  const friends = document.getElementById('friends-number');
  friends.value = data.friends;

  const transport = document.getElementById('transport');
  if (data.amenities.transport) transport.checked = true;
  else transport.checked = false;
  const breakfasts = document.getElementById('breakfasts');
  if (data.amenities.breakfasts) breakfasts.checked = true;
  else breakfasts.checked = false;
  const dinners = document.getElementById('dinners');
  if (data.amenities.dinners) dinners.checked = true;
  else dinners.checked = false;
  const sauna = document.getElementById('sauna');
  if (data.amenities.sauna) sauna.checked = true;
  else sauna.checked = false;
};

const editTrip = (key) => {
  const data = JSON.parse(sessionStorage.getItem(key));
  placeImageAndTitle(data.image.src, data.image.alt, data.title);
  fillFormWithDate(data, key);

  const modal = document.querySelector('.modal-form');

  modal.showModal();
};

const deleteTrip = (key) => {
  const deleteDialog = document.querySelector('.delete-confirm');
  const cancelDeleteDialog = document.querySelector('.cancel-delete');
  cancelDeleteDialog.addEventListener('click', () => deleteDialog.close());
  const confirm = document.querySelector('.confirm');
  confirm.addEventListener('click', () => {
    sessionStorage.removeItem(key);
    deleteDialog.close();
    generateList();
  });
  deleteDialog.showModal();
};

//generate trips list
const generateList = () => {
  const container = document.querySelector('.list-container');
  container.innerHTML = '';
  let listIsEmpty = true;

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key !== 'IsThisFirstTime_Log_From_LiveServer') {
      listIsEmpty = false;
      const item = JSON.parse(sessionStorage.getItem(key));
      const trip = document.createElement('div');
      trip.classList.add('trip');
      trip.setAttribute('id', key);
      const img = document.createElement('img');
      img.src = item.image.src;
      img.alt = item.image.alt;
      const title = document.createElement('h3');
      title.textContent = item.title;
      const user = document.createElement('p');
      user.textContent = `User: ${item.firstName} ${item.lastName}`;
      const email = document.createElement('p');
      email.textContent = `Email: ${item.email}`;
      const residence = document.createElement('p');
      const startDate = item.startDate
        .split('T')[0]
        .split('-')
        .reverse()
        .join('-');
      const endDate = item.endDate.split('T')[0].split('-').reverse().join('-');
      residence.textContent = `Residence: from ${startDate} to ${endDate}`;
      const groupSize = document.createElement('p');
      groupSize.textContent = `Group size: ${item.friends}`;
      const guide = document.createElement('p');
      guide.textContent = `Guide: ${item.guide === 'yes' ? '✔️' : '❌'}`;
      const amenities = document.createElement('p');
      amenities.textContent = 'Amenities:';
      const amenitiesList = document.createElement('ul');
      for (const el in item.amenities) {
        if (item.amenities[el] === true) {
          const li = document.createElement('li');
          li.textContent = el;
          amenitiesList.appendChild(li);
        }
      }
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.classList.add('edit');
      editBtn.addEventListener('click', () => editTrip(key));
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete');
      deleteBtn.addEventListener('click', () => deleteTrip(key));

      trip.appendChild(img);
      trip.appendChild(title);
      trip.appendChild(user);
      trip.appendChild(email);
      trip.appendChild(residence);
      trip.appendChild(groupSize);
      trip.appendChild(guide);
      if (amenitiesList.children.length > 0) {
        trip.appendChild(amenities);
        trip.appendChild(amenitiesList);
      }
      trip.appendChild(editBtn);
      trip.appendChild(deleteBtn);
      container.appendChild(trip);
    }
  }
  if (listIsEmpty) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('empty-div');
    const info = document.createElement('p');
    info.textContent = "Your list is empty! Let's plan your holidays!";
    info.classList.add('empty-list');
    const link = document.createElement('a');
    link.textContent = 'Available Places';
    link.href = '../pages/available-places.html';
    emptyDiv.appendChild(info);
    emptyDiv.appendChild(link);
    container.appendChild(emptyDiv);
  }
};

if (document.querySelector('.nav-link.active').textContent === 'Home')
  fetchData(generateTrendingPlaces, true);
else if (
  document.querySelector('.nav-link.active').textContent === 'Holidays List'
) {
  generateList();

  const modal = document.querySelector('.modal-form');
  const closeModal = document.querySelector('.close');
  closeModal.addEventListener('click', () => modal.close());

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const key = e.target.id;
    addEditTrip(key, EDIT);
    modal.close();
    generateList();
  });
} else {
  fetchData(generateAvailablePlaces, false);
  const modal = document.querySelector('.modal-form');
  const closeModal = document.querySelector('.close');
  closeModal.addEventListener('click', () => modal.close());
  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!document.querySelector('.date-warning').classList.contains('active')) {
      addEditTrip(keyId, ADD);
      modal.close();
      window.location.href = '../pages/holidays-list.html';
    }
  });
}
