const festSection = document.querySelector(".fest-section");
const indieSection = document.querySelector(".indie-section");

const festivalData = () => {
  var options = {
    url:
      "https://cors-anywhere.herokuapp.com/http://eacodingtest.digital.energyaustralia.com.au/api/v1/festivals",
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      console.log("error");
      window.location.reload();
    },
    // this is how I am dealing with the 429 throttling error by alerting the user and then refreshing the page
    statusCode: {
      429: function() {
        alert("Exceeded request limit page will now refresh.");
        window.location.reload();
      }
    }
  };

  // Here is wehere I am dealing with response by using AJAX via jQuery
  $.ajax(options).done(function(resp) {
    if (resp) {
      let results = resp;
      let festivalObject = {};

      results.forEach(result => {
        result.bands.forEach(band => {
          if (festivalObject[band.recordLabel]) {
            festivalObject[band.recordLabel].forEach(fest => {
              fest.festival.push(result.name);
            });
            festivalObject[band.recordLabel].push({
              band: band.name,
              festival: [result.name]
            });
          } else {
            festivalObject[band.recordLabel] = [
              {
                band: band.name,
                festival: [result.name]
              }
            ];
          }
        });
      });

      // Here is Where I am dealing with the dupiclates as well as the undefined
      results.forEach(result => {
        result.bands.forEach(band => {
          festivalObject[band.recordLabel].forEach(fest => {
            fest.festival = [...new Set(fest.festival)].filter(n => n);
          });
        });
      });

      // Here is where I am displaying the restructed data as per request via the console after restructuring it from the above mentioned code
      console.log(festivalObject);

      // Here is where I am displaying the in the information on the website
      Object.entries(festivalObject)
        .sort()
        .forEach(([label, band]) => {
          Object.entries(band)
            .sort()
            .forEach(([k, v]) => {
              if (label === "undefined" || label === "") {
                indieSection.innerHTML += `
                <p class="band-info"><span>Band:</span> ${
                  v.band
                } <span>Festivals:</span> ${v.festival.join(", ")}
                </p>`;
              } else if (label) {
                festSection.innerHTML += `
                <h1 class="rec-label-heading">Record Label: ${label}</h1>
                <p class="band-info"><span>Band:</span> ${
                  v.band
                } <span>Festivals:</span> ${v.festival.join(", ")}
                </p>`;
              } else if (!label) {
                festSection.innerHTML += `
                <p class="band-info"><span>Band:</span> ${
                  v.band
                } <span>Festivals:</span> ${v.festival.join(", ")}
                </p>`;
              }
            });
        });
    } else {
      // the reason I have this cobe below is to deal with errors by reloading the page
      window.location.reload();
    }
  });
};

festivalData();
