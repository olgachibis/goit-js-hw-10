import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

const cleanMarkup = ref => (ref.innerHTML = '');

const inputCountry = e => {
const nameCountry = e.target.value.trim();

  if (!nameCountry) {
    cleanMarkup(listEl);
    cleanMarkup(infoEl);
    return;
  }
   
  fetchCountries(nameCountry)
    .then(countries => {
      console.log(countries);
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name');
        return;
      }
      renderMarkup(countries);
    })
    .catch(err => {
      cleanMarkup(listEl);
      cleanMarkup(infoEl);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderMarkup = countries => {
  if (countries.length === 1) {
    cleanMarkup(listEl);
    const markupInfo = createInfoMarkup(countries);
    infoEl.innerHTML = markupInfo;
  } else {
    cleanMarkup(infoEl);
    const markupList = createListMarkup(countries);
    listEl.innerHTML = markupList;
  }
};

const createListMarkup = countries => {
  return countries
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createInfoMarkup = countries => {
    return countries
    .map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${name.official}" width="40" height="40">${
        name.official
      }</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

searchEl.addEventListener('input', debounce(inputCountry, DEBOUNCE_DELAY));