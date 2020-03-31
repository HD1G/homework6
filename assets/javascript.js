//open weather api and query url
var APIKey = "&appid=3f105fed4dd8fcbd85ea996a2658b0ad";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=";

var citiesArray = JSON.parse(localStorage.getItem("cities")) || [];

const m = moment();

$(document).ready(function() {
	var city = citiesArray[citiesArray.length - 1];
	threeDay(city);
	citySearch(city);
});
//makes rows of text for searched cities
function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

// clears the fields
function citySearch(city) {
	$(".city").empty();
	$(".temp").empty();
	$(".humidity").empty();
	$(".wind").empty();
	$(".uvIndex").empty();

	var citySearch = queryURL + city + APIKey;
	console.log(citySearch);

//ajax get city from open weather api
	$.ajax({
		url: citySearch,
		method: "GET"
		//then pull information from api 
	}).then(function(response) {
		var cityInfo = response.name;
		console.log(cityInfo);
		var dateInfo = response.dt;
		console.log(dateInfo);
		var currentDate = moment.unix(dateInfo).format("L");
		console.log("current date" + currentDate);
		var iconDummy = "https://openweathermap.org/img/wn/";
		var iconPng = "@2x.png";
		var iconWeather = response.weather[0].icon;
		var iconUrl = iconDummy + iconWeather + iconPng;
		console.log(iconUrl);
		var iconImg = $("<img>");
		iconImg.attr("src", iconUrl);
		$(".city").append(cityInfo + " ");
		$(".city").append(currentDate + " ");
		$(".city").append(iconImg);

		//used kelvin to ferenheit formula from activity
		console.log(response.main.temp);
		var K = response.main.temp;
		console.log(K);
		var F = ((K - 273.15) * 1.8 + 32).toFixed(0);
		console.log(F);
		$(".temp").append("Temperature: " + F + " °F");

		var humidityInfo = response.main.humidity;
		$(".humidity").append("Humidity: " + humidityInfo + "%");

		//convert to mph
		console.log(response.wind.speed);
		var oldSpeed = response.wind.speed;
		console.log(oldSpeed);
		var newSpeed = (oldSpeed * 2.2369).toFixed(2);
		$(".wind").append("Wind Speed: " + newSpeed + " MPH");

		var lon = response.coord.lon;
		var lat = response.coord.lat;

		uvIndex(lon, lat);
	});
}

//function to add queried cities to list div under search
function renderButtons() {
	$(".list-group").empty();

	for (var i = 0; i < citiesArray.length; i++) {
		var a = $("<li>");
		a.addClass("cityName");
		a.addClass("list-group-item");
		a.attr("data-name", citiesArray[i]);
		a.text(citiesArray[i]);
		$(".list-group").append(a);
	}

	$(".cityName").on("click", function(event) {
		event.preventDefault();

		var city = $(this).data("name");
		console.log("previous city" + city);

		threeDay(city);
		citySearch(city);
	});
}


//function to retrieve UV index
function uvIndex(lon, lat) {
	var indexURL = "https://api.openweathermap.org/data/2.5/uvi?appid=3f105fed4dd8fcbd85ea996a2658b0ad&lat=";
	var middle = "&lon=";
	var indexSearch = indexURL + lat + middle + lon;
	console.log(indexSearch);

	$.ajax({
		url: indexSearch,
		method: "GET"
	}).then(function(response) {
		var uvFinal = response.value;
		$(".uvIndex").append("UV Index: ");
		var uvBtn = $("<button>").text(uvFinal);
		$(".uvIndex").append(uvBtn);
		// color code buttons based on UV index
		if (uvFinal < 3) {
			uvBtn.attr("class", "uvGreen");
		} else if (uvFinal < 6) {
			uvBtn.attr("class", "uvYellow");
		} else {
			uvBtn.attr("class", "uvRed");
		}
	});
}

//function to get 3 day forecast for city
function threeDay(city) {
	var threeFront = "https://api.openweathermap.org/data/2.5/forecast?q=";
	var threeURL = threeFront + city + APIKey;
	console.log(threeURL);

	//clears data
	$(".card-text").empty();
	$(".card-title").empty();
//begin building 3 day cards - dates , icon, temperature, humidity
	$.ajax({
		url: threeURL,
		method: "GET"
	}).then(function(response) {
		var dateOne = moment
			.unix(response.list[1].dt)
			.utc()
			.format("L");
		$(".dateOne").append(dateOne);
		var dateTwo = moment
			.unix(response.list[9].dt)
			.utc()
			.format("L");
		$(".dateTwo").append(dateTwo);
		var dateThree = moment
			.unix(response.list[17].dt)
			.utc()
			.format("L");
		$(".dateThree").append(dateThree);
		var dateFour = moment
			.unix(response.list[25].dt)
			.utc()
			.format("L");
		var iconOne = $("<img>");
		var iconOneSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[4].weather[0].icon +
			"@2x.png";
		console.log("card Icon line 280" + iconOneSrc);
		iconOne.attr("src", iconOneSrc);
		$(".iconOne").append(iconOne);

		var iconTwo = $("<img>");
		var iconTwoSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[12].weather[0].icon +
			"@2x.png";
		iconTwo.attr("src", iconTwoSrc);
		$(".iconTwo").append(iconTwo);

		var iconThree = $("<img>");
		var iconThreeSrc =
			"https://openweathermap.org/img/wn/" +
			response.list[20].weather[0].icon +
			"@2x.png";
		iconThree.attr("src", iconThreeSrc);
		$(".iconThree").append(iconThree);
		$(".tempOne").append("Temperature: ");
		$(".tempOne").append(
			tempAvg(
				response.list[2].main.temp,
				response.list[4].main.temp,
				response.list[6].main.temp
			)
		);
		$(".tempOne").append(" °F");

		$(".tempTwo").append("Temperature: ");
		$(".tempTwo").append(
			tempAvg(
				response.list[10].main.temp,
				response.list[12].main.temp,
				response.list[14].main.temp
			)
		);
		$(".tempTwo").append(" °F");

		$(".tempThree").append("Temperature: ");
		$(".tempThree").append(
			tempAvg(
				response.list[18].main.temp,
				response.list[20].main.temp,
				response.list[22].main.temp
			)
		);
		$(".tempThree").append(" °F");

		$(".humidityOne").append("Humidity: ");
		$(".humidityOne").append(
			humidityAvg(
				response.list[2].main.humidity,
				response.list[4].main.humidity,
				response.list[6].main.humidity
			)
		);
		$(".humidityOne").append("%");

		$(".humidityTwo").append("Humidity: ");
		$(".humidityTwo").append(
			humidityAvg(
				response.list[10].main.humidity,
				response.list[12].main.humidity,
				response.list[14].main.humidity
			)
		);
		$(".humidityTwo").append("%");

		$(".humidityThree").append("Humidity: ");
		$(".humidityThree").append(
			humidityAvg(
				response.list[18].main.humidity,
				response.list[20].main.humidity,
				response.list[22].main.humidity
			)
		);
		$(".humidityThree").append("%");
	});
}
//end 3 day cards

function tempAvg(x, y, z) {
	var avgThree = (x + y + z) / 3.0;
	var avgReturn = ((avgThree - 273.15) * 1.8 + 32).toFixed(0);
	return avgReturn;
}

function humidityAvg(x, y, z) {
	var avgHum = (x + y + z) / 3.0;
	return avgHum.toFixed(0);
}

//event listener
$("#search-button").on("click", function(event) {
	event.preventDefault();

	//adds city to array
	var city = $("#search-value")
		.val()
		.trim();

	var containsCity = false;

	if (citiesArray != null) {
		$(citiesArray).each(function(x) {
			if (citiesArray[x] === city) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
		citiesArray.push(city);
	}

	localStorage.setItem("cities", JSON.stringify(citiesArray));

	threeDay(city);

	citySearch(city);

	renderButtons();
});

renderButtons();