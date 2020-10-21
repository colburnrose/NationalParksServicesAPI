"use strict";

const apiKey = "alFfMlptmgQPndZf6pB7FmLk8BwFjFPrMFRcHQwu";
const URL = "https://developer.nps.gov/api/v1/parks";

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(response) {
  console.log(response);
  $("#results-list").empty();

  for (let i = 0; i < response.data.length; i++) {
    let address = response.data[i].addresses[i];
    if (address !== undefined) {
      $("#results-list").append(
        `
        <li><h2>${response.data[i].fullName}</h2>
        <p>${response.data[i].description}</p>
        <p>${response.data[i].url}</p>
        <p>Address: ${address.line1}, ${address.city}${address.stateCode}, ${address.postalCode}</p>
        </li>
        `
      );
    }
  }
  $("#results").removeClass("hidden");
}

function getNationalParksService(query, maxResults = 10) {
  const params = {
    stateCode: query,
    limit: maxResults,
  };

  const options = {
    headers: new Headers({
      "x-api-key": apiKey,
    }),
  };

  const queryString = formatQueryParams(params);
  const url = URL + "?" + queryString;
  console.log("Request initiated...");
  fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((error) => {
      $("#js-error-message").text(`Error making your request ${error.message}`);
    });
}

function watchForm() {
  $("form").submit((e) => {
    e.preventDefault();
    console.log("App activiated...");
    let park = $("#js-search-state").val();
    let number = $("#js-max-results").val();
    getNationalParksService(park, number);
  });
}

$(watchForm);
