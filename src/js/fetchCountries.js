import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then(res => res.status === 404 ? Promice.reject() : res.json()).catch(err => Notify.failure("Oops, there is no country with that name"));
}
