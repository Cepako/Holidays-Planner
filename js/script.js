//bars animation

const bars = document.querySelectorAll('.bar');

const animateBars = () => {
  bars.forEach((bar) => bar.classList.toggle('active'));
};

document
  .querySelector('.navbar-toggler')
  .addEventListener('click', animateBars);

//data fetching

const fetchData = async (passedFunction) => {
  const response = await fetch('../places.json');

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

//modal and form

const openForm = ({ title, image }) => {
  const modal = document.querySelector('.modal-form');
  modal.innerHTML = '';
  const modalImage = document.createElement('img');
  modalImage.src = `../images/${image.src}`;
  modalImage.alt = image.alt;
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = title;
  const closeModal = document.createElement('button');
  closeModal.textContent = 'Close';
  closeModal.addEventListener('click', () => modal.close());
  modal.appendChild(modalImage);
  modal.appendChild(modalTitle);
  modal.appendChild(closeModal);

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

if (document.querySelector('.nav-link.active').textContent === 'Home')
  fetchData(generateTrendingPlaces);
else if (
  document.querySelector('.nav-link.active').textContent === 'Holidays List'
) {
  console.log(document.querySelector('.nav-link.active').textContent);
} else {
  fetchData(generateAvailablePlaces);
}
