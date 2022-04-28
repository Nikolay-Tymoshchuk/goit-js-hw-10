import { Notify } from 'notiflix/build/notiflix-notify-aio';
import MyError from './myError';
const BASIC_URL = 'https://restcountries.com/v3.1/name/';
const OUTPUT_OPTIONS = 'name,capital,population,flags,languages';

export function fetchCountries(name) {
    return fetch(`${BASIC_URL}${name}?fields=${OUTPUT_OPTIONS}`)
    .then(res => {

        if (res.status === 404) {
            throw new MyError();
        }

        let type = res.headers.get('Content-Type');
        if (type !== 'application/json') {
            throw new TypeError();
        }
        return res.json();
    })
    .then(data => {
        if (data.length > 10) {
            Notify.info("Too many matches found. Please enter a more specific name.");
            return;
        }
        return data;
    })
    .catch(err => {
        if (err instanceof MyError) {
            Notify.failure("Oops, there is no country with that name");
        }
        else if (err instanceof TypeError) {
            Notify.failure("Expected JSON response but got " + type);
        }
        else {
            Notify.failure("Something went wrong");
        }
    });
}
//  .then(res => res.status === 404 ? Promice.reject() : res.json()).catch(err => Notify.failure("Oops, there is no country with that name"));