import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}

const title = document.createElement('h1');
title.classList.add('title');
title.textContent = 'Enter a country name';
document.body.insertAdjacentElement('afterbegin', title);

refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
    e.preventDefault();

    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    refs.info.style.padding = '0';
    

    const inputValue = e.target.value.trim();

    if (inputValue.length < 1) {
        return;
    }
    
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

function createListItem(list, item) {
    refs.info.style.padding = '0';
    
    const li = document.createElement('li');
    li.classList.add('country');
    li.innerHTML = `
        <img class="country__flag" src="${item.flags.svg}" alt="${item.name.official}">
        <span class="country__name">${item.name.official}</span>
    `;
    list.appendChild(li);
}

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

refs.list.addEventListener('click', handleClick);

function handleClick(event) {
    if (event.target === event.currentTarget) return;
    const country = event.target.closest('.country');
    if (!country) return;
    const countryName = country.querySelector('.country__name').textContent;
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    fetchCountries(countryName).then(data => createCountryInfoBox(refs.info, data[0]));
    
}