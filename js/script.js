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

const generatePlaces = (data) => {
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
    cart.appendChild(img);
    cart.appendChild(title);
    container.appendChild(cart);
  }
};

fetchData(generatePlaces);
