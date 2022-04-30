import { Notify } from 'notiflix/build/notiflix-notify-aio';
import MyError from './myError';
const BASIC_URL = 'https://restcountries.com/v3.1/name/';
const OUTPUT_OPTIONS = 'name,capital,population,flags,languages';

// Set options for Notifications

Notify.init({position: 'center-top', timeout: 1500});

/**
 * Initialization of the function, which returns the promise with the data from the publick API
 * @param {string} name 
 * @returns promise;
 */

function fetchCountries(name) {
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

// Export the function for use in other modules

export { fetchCountries };

// End of file