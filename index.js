$(document).ready(function () {
  $("#burger").click(function () {
    $("#sidebar").toggleClass("sidebar-open");
    $(".container").toggleClass("container-shift");
    $("#burger").toggleClass("cross");
  });
});

$("#searchCity").keypress(function (event) {
  if (event.which === 13) {
    event.preventDefault();
    if ($("#searchCity").val() === "") {
      alert("Please enter a city");
    } else {
      city = $("#searchCity").val();
      fetchData(city);
    }
  }
});

const key = "FP6U7553EBYTTFR8MDSEG4LCB";
async function fetchData(arg1, arg2) {
  $(".loader").css("display", "block");
  if (!arg1 || !arg2) {
    city = arg1;
  } else {
    city = arg1 + "," + arg2;
  }
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today?unitGroup=metric&key=${key}&contentType=json`
  );
  const data = await response.json();
  const {
    conditions,
    datetime,
    feelslike,
    humidity,
    pressure,
    sunrise,
    sunset,
    temp,
    visibility,
    winddir,
    windspeed,
    tempmax,
    tempmin,
    uvindex,
    description,
  } = data.days[0];
  $("#address").text(
    arg1 && arg2 ? await getCity(arg1, arg2) : data.resolvedAddress
  );
  $("#temp").html(temp + "°C");
  $("#weatherIcon").attr("src", `icons/${conditions}.png`);
  $("#conditions").text(conditions);
  $("#dateTime").text(`Time: ${datetime}`);
  $("#wind").html(
    "<strong>Wind: </strong>" + windspeed + " km/h - " + winddir + "°"
  );
  $("#humidity").html("<strong>Humidity: </strong>" + humidity + "%");
  $("#pressure").html("<strong>Pressure: </strong>" + pressure + " hPa");
  $("#visibility").html(`<strong>Visibility: </strong>${visibility} km`);
  $("#sunrise").html(`<strong>Sunrise: </strong>${sunrise}`);
  $("#sunset").html(`<strong>Sunset: </strong>${sunset}`);
  $("#feelslike").html("<strong>Feels Like: </strong>" + feelslike + "°C");
  $("#uvindex").html("<strong>UV Index: </strong>" + uvindex);
  $("#sunrise2").html(`<strong>Sunrise: </strong>${sunrise}`);
  $("#sunset2").html(`<strong>Sunset: </strong>${sunset}`);
  $("#max-temp").html("<strong>Max Temp: </strong>" + tempmax + "°C");
  $("#min-temp").html("<strong>Min Temp: </strong>" + tempmin + "°C");
  $("#desc").text(description);

  $("#tableBody").html(
    data.days[0].hours.map((hour) => {
      return `<tr><td>${hour.datetime}</td><td>${hour.temp}°C</td><td>${hour.humidity}%</td><td>${hour.pressure} hPa</td><td>${hour.visibility} km</td><td>${hour.conditions}</td><td>${hour.windspeed} km/h - ${hour.winddir}°</td></tr><tr>`;
    })
  );
  $(".loader").css("display", "none");
  $("#table").css("display", "block");
}

const printContent = () => {
  const header = document.querySelector(".header");
  header.style.visibility = "hidden";
  window.print();
  header.style.visibility = "visible";
};

const logo = document.querySelector(".logo");
logo.addEventListener("click", function (event) {
  const navbar = document.querySelector(".navbar");
  event.preventDefault();
  navbar.classList.toggle("close");
});

//request location access from browser and get city?

function getLocation() {
  navigator.permissions
    ? navigator.permissions
        .query({
          name: "geolocation",
        })
        .then((permission) =>
          permission.state === "granted"
            ? navigator.geolocation.getCurrentPosition((position) => {
                fetchData(position.coords.latitude, position.coords.longitude);
              })
            : fetchData("india")
        )
    : fetchData("india");
}

getLocation();

async function getCity(latitude, longitude) {
  const apiKey = "b559443d73034f69b1588c9812c504d1";
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  const resp = await fetch(url);
  const data = await resp.json();
  const city = data.results[0].components.city;
  return city;
}
