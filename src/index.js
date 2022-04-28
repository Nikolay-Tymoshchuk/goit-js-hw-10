import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import listItemsTpl from './templates/list-items.hbs';
const debounce = require('lodash.debounce');

// Initialization  of veraibles

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}
const title = document.createElement('h1');

// Generation the title

title.classList.add('title');
title.textContent = 'Enter a country name';
document.body.insertAdjacentElement('afterbegin', title);

// Initialization of event listeners

refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));
refs.list.addEventListener('click', handleClickByListItem);

// Inicialization of handleInput function, which is responsible for fetching data from the API

function handleInput(e) {
    e.preventDefault();

    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    refs.info.style.padding = '0';
    
    const inputValue = e.target.value.trim();

    if (inputValue.length < 1) {
        return;
    }

// Fetching data from the API

    fetchCountries(inputValue).then(data => {
         if (data.length >= 2 && data.length <= 10) {
            refs.list.innerHTML = '';
            document.body.style.backgroundImage = '';
            data.forEach(item => createListItem(refs.list, item));
            return
        }
        refs.info.innerHTML = '';
        createCountryInfoBox(refs.info, data[0]);
        
    });
}       

// Initialization of the function, which renders list of countries

function createListItem(list, item) {
    refs.info.style.padding = '0';
    
    const li = document.createElement('li');
    li.classList.add('country');
    li.innerHTML = listItemsTpl({item});
    console.log(item);
    list.appendChild(li);
}

// Initialization of the function, which renders country info

function createCountryInfoBox(place, data) {
    document.body.style.backgroundImage = `url(${data.flags.svg})`;
    document.body.style.backgroundSize = 'cover';
    refs.info.style.padding = '10px';
    place.innerHTML = `
    <img class="country-info__flag" src="${data.flags.svg}" alt="${data.name.official}">
    <div class="country-info__name">${data.name.official}</div>
    <div class="country-info__capital">Capital: ${data.capital}</div>
    <div class="country-info__population">Population: ${data.population.toLocaleString()}</div>
    <span class="country__languages">Languages: ${Object.values(data.languages).join(', ')}</span>
`
}

// Initialization of the function, which is responsible for rendering country info by clicking on the list item

function handleClickByListItem(event) {
    if (event.target === event.currentTarget) return;
    const country = event.target.closest('.country');
    if (!country) return;
    const countryName = country.querySelector('.country__name').textContent;
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    fetchCountries(countryName).then(data => createCountryInfoBox(refs.info, data[0]));
    
}