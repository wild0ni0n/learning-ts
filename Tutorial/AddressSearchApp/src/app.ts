// import { Axios } from "axios";

import axios from "../node_modules/axios/index";
// const axios: Axios = require('../node_modules/axios/dist/browser/axios.cjs');

const form = document.querySelector("form")!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = 'GOOGLE_API_KEY_HERE';

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number, lng: number } } }[];
    status: 'OK' | 'ZERO_RESULTS';
};

// declare var google: any;

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enterAddress = addressInput.value;

    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enterAddress)}&key=${GOOGLE_API_KEY}`
    ).then(response => {
        if (response.data.status !== 'OK') {
            throw new Error('座標を取得できませんでした');
        }
        const coordinates = response.data.results[0].geometry.location;
        const map = new google.maps.Map(document.getElementById("map")!, {
            center: coordinates,
            zoom: 16,
        });
        new google.maps.Marker({ position: coordinates, map: map });

        console.log(response);
    }).catch(err => {
        alert(err.message);
        console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);
console.log("hoge");