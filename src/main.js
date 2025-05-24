import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { getImagesByQuery } from "./js/pixabay-api";
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton } from "./js/render-functions";


const searchForm = document.querySelector('.form');
const loaderBtn = document.querySelector('.more-btn');
const loaderElSp = document.querySelector('.js-loader');


let lightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });
let currentPage = 1;
let maxPage;
let perPage = 15;
let currentQuery;

searchForm.addEventListener('submit', async evt => {
  evt.preventDefault();
  clearGallery();
  hideLoadMoreButton();

  const query = evt.target.elements['search-text'].value.trim();

  if (query === '') {
    iziToast.info({
      title: '',
      message: 'Please enter a search term to find images.',
      position: 'topRight',
      timeout: 3000,
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  showLoader();
  showLoadSpinner();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const images = data.hits;
    const totalHits = data.totalHits;

    if (images.length === 0) {
      iziToast.warning({
        title: 'Sorry',
        message: 'There are no images matching your search query. Please try again!',
        position: 'topRight',
        timeout: 3000,
      });
      return;
    }

    maxPage = Math.ceil(totalHits / perPage);

    createGallery(images);
    searchForm.reset();

    scrollPage();

    if (currentPage >= maxPage) {
      iziToast.info({
        title: '',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
      });
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    // console.error('Помилка при отриманні зображень:', error.message);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
    hideLoadSpinner();
  }
});

loaderBtn.addEventListener('click', async () => {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();
  showLoadSpinner();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    const images = data.hits;

    createGallery(images);

    // scroll after load next page
    scrollPage();

    if (currentPage >= maxPage) {
      iziToast.info({
        title: '',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        timeout: 3000,
      });
      hideLoadMoreButton();
      return;
    }

    showLoadMoreButton();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
      timeout: 3000,
    });
  } finally {
    hideLoader();
    hideLoadSpinner();
  }
});

function showLoadSpinner() {
  loaderElSp?.classList.add("load-spinner");
}

function hideLoadSpinner() {
  loaderElSp?.classList.remove("load-spinner");
}

function scrollPage() {
  const card = document.querySelector('.item-image');
  if (card) {
    const cardHeight = card.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }
}