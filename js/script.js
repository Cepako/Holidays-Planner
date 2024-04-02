//bars animation

const bars = document.querySelectorAll('.bar');

const animateBars = () => {
  bars.forEach((bar) => bar.classList.toggle('active'));
};

document
  .querySelector('.navbar-toggler')
  .addEventListener('click', animateBars);
