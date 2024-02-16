const colorSet = new Set();

let searchBtn = document.getElementById("search-btn");

let countryInp = document.getElementById("country-inp");
// searchBtn.addEventListener("click", handleSubmit);

countryInp.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search-btn").click();
  }
});

function handleSubmit() {
  let countryName = countryInp.value;
  let finalUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  fetch(finalUrl)
    .then((response) => response.json())
    .then((data) => {
      //get svg URL
      const svgURL = data[0].flags.svg;

      fetch(svgURL)
        .then((response) => response.text())
        .then((svgText) => {
          //Create a DomParser to parse the svg text
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

          // get all the path elements in the svg
          // const pathElements = svgDoc.querySelectorAll("path");
          const elements = svgDoc.querySelectorAll("[fill]");

          //record color hex codes in an array
          elements.forEach((element) => {
            const fill = element.getAttribute("fill");
            if (fill && fill != "none") {
              colorSet.add(fill);
            }
          });

          //convert set to array
          const colorArray = Array.from(colorSet);
          //set background gradient based on color array

          const gradient = `linear-gradient(to right , ${colorArray.join(
            ","
          )})`;
          document.body.style.background = gradient;

          clearingSet(colorSet, colorArray);
        });

      result.innerHTML = `
  
          <div class= "header"><h1>${data[0].name.official}</h1> </div>
          <div class="heading">
  
        <img src= "${data[0].flags.svg}" class="flag-img"></img>
        <h2>${data[0].name.common}&nbsp;</h2>
        <img src = "${data[0].coatOfArms.svg}" class="coatOfArms"/>
        </div>
        <div class="wrapper">
        <div class="data-wrapper">
        <h4>Capital : </h4>
        <span>${data[0].capital[0]}</span>
  
        </div>
        </div>
        <div class="wrapper">
        <div class="data-wrapper">
            <h4>Continent:</h4>
            <span>${data[0].continents[0]}</span>
        </div>
    </div>
     <div class="wrapper">
        <div class="data-wrapper">
            <h4>Population:</h4>
            <span>${data[0].population}</span>
        </div>
    </div>
    <div class="wrapper">
        <div class="data-wrapper">
            <h4>Currency:</h4>
            <span>${
              data[0].currencies[Object.keys(data[0].currencies)].name
            } - ${Object.keys(data[0].currencies)[0]} - ${
        data[0].currencies[Object.keys(data[0].currencies)].symbol
      }
          </span>
        </div>
    </div>
    <div class="wrapper">
    <div class="data-wrapper">
        <h4>Common Languages:</h4>
        <span>${Object.values(data[0].languages)
          .toString()
          .split(",")
          .join(", ")}</span>
          </div>
    </div>
    <div class="wrapper"><div class="data-wrapper"><h4>Timezones : </h4>
    <span>${data[0].timezones[0]}</span></div></div>
        `;
    })
    .catch(() => {
      if (countryName.length == 0) {
        result.innerHTML = `<h3>The input field cannot be empty</h3>`;
      } else {
        result.innerHTML = `<h3>Please enter a valid country name.</h3>`;
      }
    });
}

function clearingSet(colorSet, colorArray) {
  for (let i = colorArray.length - 1; i >= 0; i--) {
    colorArray.pop();
  }
  colorSet.clear();
}
