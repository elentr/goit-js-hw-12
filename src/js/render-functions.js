import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector('.gallery');
const loaderEl = document.querySelector('.loader');
const loaderBtn = document.querySelector('.more-btn');
let lightbox;

export function createGallery(images) {
  const markup = images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
      `<li class="item-image">
        <a href="${largeImageURL}">
          <img class="image" src="${webformatURL}" alt="${tags}">
        </a>
        <div class="info">
          <p class="info-item"><span>Likes</span> ${likes}</p>
          <p class="info-item"><span>Views</span> ${views}</p>
          <p class="info-item"><span>Comments</span> ${comments}</p>
          <p class="info-item"><span>Downloads</span> ${downloads}</p>
        </div>
      </li>`
    ).join('\n');
  gallery.insertAdjacentHTML('beforeend', markup);
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionsPosition: 'bottom',
      captionsDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

export function showLoader() {
  loaderEl?.classList.remove("hidden");
}

export function hideLoader() {
  loaderEl?.classList.add("hidden");
}

export function clearGallery() {
  if (!gallery) return;
  gallery.innerHTML = '';
  if (lightbox) {
    lightbox.destroy();
    lightbox = null;
  }
}

export function showLoadMoreButton() {
  loaderBtn?.classList.remove("hidden");
}

export function hideLoadMoreButton() {
  loaderBtn?.classList.add("hidden");
}

