import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetchCountries';
const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;
const refs = {
    input: document.querySelector('#search-box'),
    list: document.querySelector('.country-list'),
    info: document.querySelector('.country-info'),
}


refs.input.addEventListener('input', debounce(handleInput, DEBOUNCE_DELAY));

function handleInput(e) {
    e.preventDefault();
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
    const inputValue = e.target.value;
    fetchCountries(inputValue).then(data => {
        if (data.length > 10) {
            Notify.info("Too many matches found. Please enter a more specific name.");
            return;
        }
        else if (data.length >= 2 && data.length <= 10) {
            refs.list.innerHTML = '';
            data.forEach(item => {
                const li = document.createElement('li');
                li.classList.add('country');
                li.innerHTML = `
                    <img class="country__flag" src="${item.flags.svg}" alt="${item.name.official}">
                    <span class="country__name">${item.name.official}</span>
                `;
                refs.list.appendChild(li);
            });
        }
        else if (data.length === 1) {
            refs.info.innerHTML = '';
            refs.info.innerHTML = `
                <img class="country-info__flag" src="${data[0].flags.svg}" alt="${data[0].name.official}">
                <div class="country-info__name">${data[0].name.official}</div>
                <div class="country-info__capital">Capital: ${data[0].capital}</div>
                <div class="country-info__population">Population: ${data[0].population}</div>
                <span class="country__languages">Languages: ${Object.values(data[0].languages).join(', ')}</span>
            `;
        }
    }).catch("Shit, something went wrong");
}       

