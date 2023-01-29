import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { serverRequest } from './server_request';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};


const simpleLightboxOptions = {
  captionsData: 'alt',
  captionDelay: 250,
};
const gallerySet = new SimpleLightbox('.gallery a', simpleLightboxOptions);
let page = 1;
let customRequest = '';
refs.form.addEventListener('submit', submitQuery);
refs.loadMoreBtn.addEventListener('click', loadMoreQuery);
refs.loadMoreBtn.classList.add('is-hidden');


async function submitQuery(e) {
  refs.loadMoreBtn.classList.add('is-hidden');
  e.preventDefault();
  page = 1;
  customRequest = e.currentTarget.elements.searchQuery.value.trim();
  
  if (!customRequest) {
    clearGallery();
    return Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  clearGallery();

  await serverRequest(customRequest, page)
    .then(data => {
      
      if (data.hits.length === 0) {
        Notify.failure(
          ` Please try again.`
        );
        return;
      }
      renderGalleryImg(data);
      gallerySet.refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      refs.loadMoreBtn.classList.remove('is-hidden');
    })
    .catch(_error => console.log('error'));

  return customRequest;
}

async function loadMoreQuery(e) {
  page += 1;
  await serverRequest(customRequest, page)
    .then(data => {
      if (data.hits.length < 40) {
        refs.loadMoreBtn.classList.add('is-hidden');
        Notify.info(
          `"We're sorry, but you've reached the end of search results.`
        );
      }
      renderGalleryImg(data);
      gallerySet.refresh();
    })
    .catch(_error => console.log('error'));
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function renderGalleryImg(data) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(data));
}
// СОЗДАНИЕ РАЗМЕТКИ
function createMarkup(data) {
  const dataForMarkup = data.hits;

  return dataForMarkup
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
<div class="photo-card">
<a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" title="" width="290px" height="190px"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div>
</div>
`;
      }
    )
    .join('');
}
