//when i enter the homepage, I have the drop menu for each state
//an event listener for dropdown that populates a list for each state
//when i click on the state I want then i get a list of every park within my state
//populate the list with the info you get from the API, likely state and park as queries
//the park names become links to a new page that gives me the weather for that location and a picture and a link to the NPS park site
//we need the weather api to find the location of the chosen park and populate that data into the weatherBox on the html... somehow mapquest helps with this
//stored locally are 'Your recent adventures' which are the parks you looked at already
//at the bottom of the page you will always see 'Your recent adventures' to help you plan your vacation, recents populates of the picture of that park you looked at
function render() {
  $("#searchResults").hide();

  let slideIndex = 0;
  carousel();

  function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > x.length) { slideIndex = 1 }
    x[slideIndex - 1].style.display = "block";
    setTimeout(carousel, 6000); // Change image every 2 seconds
  }


  /* let latitude;
  let longitude; */
  let state;
  /* let parkPicked = ""; */
  /*let lat;
  var lon; */
  /* Getting the localstorage */
  let cityCodeSearched = JSON.parse(localStorage.getItem("city-code")) || [];
  //statecode function it calls the parks
  function trailFind() {
    const requestUrl = "https://developer.nps.gov/api/v1/parks?stateCode=" + state + "&api_key=egaEomzHPAgI7vA1qMt3Hl0c3Po2WGueGNbdExWh";

    fetch(requestUrl)
      .then(function (data) {
        return data.json();
      }).then(function (data) {
        console.log(data);
        console.log(data.data);
        for (let i = 0; i < data.data.length; i++) {
          /* console.log(data.data.length); */

          /* console.log(latitude);
          console.log(longitude); */

          /* console.log(data.data.length); */
          let response = data.data[i];
          latitude = response.latitude;
          longitude = response.longitude;
          let imgParkCode = response.parkCode
          /* console.log(response.url); */
          /* let link = $("<a>").attr("href", response.url); */
          /* localStorage.setItem(`nationalName-${i}`, response.fullName); */
          /* console.log(response.fullName); */
          /* let card = document.getElementById("#") */
          let divCell = $("<div>").addClass("cell");
          $(divCell).click(function () {
            //when I click on a park image then the recent adventures div is visible
            $(".recent-adventures").css("visibility", "visible");
          })

          let card = $("<div>").addClass("card");
          let imgSrc = $(`<img data-park="${imgParkCode}">`).addClass("image-Park").attr({
            "data-lati": latitude,
            "data-long": longitude
          });
          //put id tag that goes on the img so that when it calls park chosen you can pass the id of what clicked into the park chosen function (this is the park code)

          // $("img").click(function () {
          //   //when I click on a park image then the recent adventures div is visible
          //   $(".recent-adventures").css("visibility", "visible");
          //   //when I click on a park imge then the image becomes a 

          // })
          if (response.images[0] && response.images[0].url) {
            imgSrc.attr("src", response.images[0].url)
            //how many images we have
            //math.floor.random
            //images.length
            //
          }
          let divCardSection = $("<div>").addClass("card-section");
          let pTag = $("<a>").addClass("park-pointer").text(response.fullName).attr({
            href: response.url,
            target: '_blank'
          });

          divCell.append(card);
          card.append(imgSrc, divCardSection);
          divCardSection.append(pTag);
          $("#parks").append(divCell);
          /* let divCardContent = $("<div>").addClass("card-content");
          let cardBodyDiv = $("<div>").addClass("card-body");
          let mediaClass = $("<div>").addClass("media");
          let mediaContent = $("<div>").addClass("media-content"); */
        }
      })
  }

  $("#SubmitBtn").on("click", function (event) {
    event.preventDefault();
    $("#parks").empty();
    $("#searchResults").hide();
    state = $("#given-input").val().trim().toUpperCase();
    /* Adding the code that searched last into the searched list */
    if (!cityCodeSearched.includes(state)) {
      /* pushes the statecode you searched */
      (cityCodeSearched).push(state);
    }
    /* deletes the state code more than 5 */
    if (cityCodeSearched.length > 3) {
      /* pushes out the statecode you searched last more than 3 */
      cityCodeSearched.shift();
    }
    searchedStates()
    trailFind();

    /* Local Storage Stores for Searched States */
    localStorage.setItem("city-code", JSON.stringify(cityCodeSearched));
    $("#given-input").val("");
  })



  //weather api
  //we need the weather api to find the location of the chosen park and populate that data into the weatherBox on the html... somehow mapquest helps with this
  //use .find in jQuery to grab lat and long 
  //get from park api 

  //wherever call function weatherLatLon need to put in arguments of latitude longitude 
  function weatherLatLon(parkLongtitude, parkLatitude) {
    let requestWeatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + parkLatitude + "&lon=" + parkLongtitude + "&units=imperial&appid=ca7c03ab6ebfee5c7d96f4deeccbecc0";

    fetch(requestWeatherUrl)
      .then(function (response) {
        return response.json();
      }).then(function (response) {
        console.log(response);
        $("#fetch-five").empty();
        for (let i = 0; i < 40; i += 8) {
          let days = response.list[i];
          /* console.log(response.list[0].dt_txt); */

          let cardInit = $("<div>").addClass("whole");
          let cardDay = $("<div>").text(days.dt_txt.slice(0, 10));
          /* console.log(response.list[0].main.temp + "˚F"); */
          let degree = $("<p>").text(Math.round(days.main.temp) + "˚F");
          /* console.log(response.list[0].main.humidity + " %"); */
          let humid = $("<p>").text("Humidity: " + days.main.humidity + "%");
          /* console.log(response.list[0].wind.speed + " mph"); */
          let wind = $("<p>").text("wind Speed: " + Math.round(days.wind.speed) + " mph");
          let icon = $("<img>");
          icon.attr("src", "http://openweathermap.org/img/wn/" + days.weather[0].icon + "@2x.png");
          $("#weather-for-park").append(cardInit.append(cardDay, degree, icon, humid, wind));
        }
      })
  }

  function trailChosen(parkPicked) {
    let chosenUrl = "https://developer.nps.gov/api/v1/parks?parkCode=" + parkPicked + "&stateCode=" + state + "&api_key=egaEomzHPAgI7vA1qMt3Hl0c3Po2WGueGNbdExWh";

    fetch(chosenUrl)
      .then(function (response) {
        return response.json();
      }).then(function (response) {
        /* console.log(response);
        console.log(response.data[0].activities);
        console.log(response.data[0].fullName); */
        for (i = 0; i < response.data.length; i++) {
          console.log(response.data[i].entranceFees[i].cost);
          let pickedParkName = $("<p>").text(response.data[i].fullName);
          $("#parkName").append(pickedParkName);
          let operatingHours = $("<p>").text(response.data[i].operatingHours[i].description);
          $("#operating-hours").append(operatingHours);
          let entFee = $("<p>").text("$ " + response.data[i].entranceFees[i].cost);
          $("#entrance-fee").append(entFee);
          let thingsToDo = response.data[i].activities;
          for (a = 0; a < thingsToDo.length; a++) {
            let activitiesLi = $("<li>").addClass("act-list").text(thingsToDo[a].name);
            $("#act-you-can").append(activitiesLi);
          }
        }
      })
  }

  /* Seacrhed state code functıon appears ın the asıde )index.html */
  function searchedStates() {
    $("#searched").empty();
    for (let i = 0; i < cityCodeSearched.length; i++) {
      let el = $("<p class='city-code'>").text("You have recently visited: ");
      el.attr("data", cityCodeSearched[i]);
      el.text(cityCodeSearched[i]);
      $("#searched").append(el);

    }

  }

  searchedStates();
  /* It makes the searched statecode as links */
  $(document).on("click", ".city-code", function () {
    state = $(this).text();
    $("#searchResults").hide();
    $("#parks").empty();
    $("#parks").show();
    $(state).on("click", trailFind);
    trailFind();
  });


  $(document).on("click", ".image-Park", function () {
    $("#parks").hide();
    $("#searchResults").show();
    let parkLatitude = $(this).data("lati");
    let parkLongtitude = $(this).data("long");
    let parkPicked = $(this).data("park");
    console.log(parkPicked);
    weatherLatLon(parkLongtitude, parkLatitude);
    trailChosen(parkPicked);
  })

  $("#go-back-button").on("click", function () {
    $("#searchResults").hide();
    $("#parks").show();
    $("#parkName").empty();
    $("#act-you-can").empty();
    $("#operating-hours").empty();
    $("#entrance-fee").empty();
    $("#weather-for-park").empty();
  })
  //call long and lat from nps object that is returned from fetch
  //within that object we need to grab the lat and long individually and pass them into the variables of longitude and latitude
  //
  /* localStorage.setItem("Weather-in-Park",) */



  //we need the weather api to find the location of the chosen park and populate that data into the weatherBox on the html... somehow mapquest helps with this



  //stored locally are 'Your recent adventures' which are the parks you looked at already
  //when I click on a park the park is saved to local storage and then added to the recent adventures div

}
$(document).ready(render);