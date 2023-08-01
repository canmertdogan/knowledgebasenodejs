function filterResults() {
  var selectedService = $("#hizmet-select").val();
  var selectedCity = $("#il-select").val();

  var jsonFileName = "";

  if (selectedService === "1") {
    jsonFileName = "/public/json/dernekler.json";
  } else if (selectedService === "2") {
    jsonFileName = "/public/json/kulturmerkezleri.json";
  } else if (selectedService === "3") {
    jsonFileName = "/public/json/konsolosluklar.json";
  } else if (selectedService === "4") {
    jsonFileName = "/public/json/okullar.json";
  } else if (selectedService === "5") {
    jsonFileName = "/public/json/universiteler.json";
  }

  if (jsonFileName) {
    $.getJSON(jsonFileName, function (jsonData) {
      if (jsonData) {
        var sidebar = $(".liste-grup");
        var cities = $(".city");

        sidebar.empty();

        for (var i = 0; i < jsonData.centers.length; i++) {
          var data = jsonData.centers[i];
          if (!selectedCity || data.plaka_kodu === selectedCity) {
            var listItem = $("<a>")
              .addClass("list-group-item list-group-item-action py-3 lh-sm")
              .attr("href", "#")
              .attr("aria-current", "true");
            var contentContainer = $("<div>")
              .addClass(
                "d-flex w-100 align-items-center justify-content-between"
              )
              .appendTo(listItem);
            var name = $("<strong>")
              .addClass("mb-1")
              .text(data.name)
              .appendTo(contentContainer);
            var city = $("<small>")
              .text(data.il_adi)
              .appendTo(contentContainer);
            var details = $("<div>")
              .addClass("col-10 mb-1 small")
              .appendTo(listItem);
            $("<p style='font-size:14px;'>")
              .html(
                "<br><strong>Address:</strong> " +
                data.address +
                "<br><br><strong>Phone:</strong> " +
                data.phone +
                "<br><strong>Email:</strong>" +
                data.email
              )
              .appendTo(details);

            listItem.appendTo(sidebar);

            $(`.city[id='${data.plaka_kodu}']`).addClass("selected");
          }
        }
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log("JSON dosyası alınamadı. Hata: " + errorThrown);
    });
  }
}

$(document).ready(function () {
  var jsonFiles = [
    { url: "/public/json/dernekler.json", searchField: "name" },
    { url: "/public/json/kulturmerkezleri.json", searchField: "name" },
    { url: "/public/json/konsolosluklar.json", searchField: "name" },
    { url: "/public/json/okullar.json", searchField: "name" },
    // { url: "/public/json/universiteler.json", searchField: "name" }
  ];

  $("#search-button").click(function () {
    var araVeri = $("#search-input")
      .val()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .toLowerCase();
    if (araVeri !== "") {
      $("#results-list").empty();
      searchInJsonFiles(araVeri);
    }
  });

  function searchInJsonFiles(searchTerm) {
    var results = [];

    $.each(jsonFiles, function (index, jsonFile) {
      $.getJSON(jsonFile.url, function (jsonData) {
        if (jsonData) {
          var eslesenSonuclar = jsonData.centers.filter(function (center) {
            var barVerisi = center[jsonFile.searchField].toLowerCase();
            return barVerisi.includes(searchTerm.toLowerCase());
          });

          results = results.concat(eslesenSonuclar);

          if (index === jsonFiles.length - 1) {
            results.sort(function () {
              return 0.5 - Math.random();
            });

            displayResults(results);
            hohogo(results);
          }
        }
      }).fail(function (hataatis) {
        console.log("JSON dosyası alınamadı. Hata: " + hataatis);
      });
    });
  }

  function displayResults(results) {
    var sidebar = $("#results-list");
    sidebar.empty();

    if (results.length === 0) {
      sidebar.append("<li>Arama sonucu bulunamadı.</li>");
    } else {
      $.each(results, function (index, result) {
        var listItem = $("<li>")
          .addClass("list-group-item list-group-item-action py-3 lh-sm")
          .attr("aria-current", "true");

        var contentContainer = $("<div>")
          .addClass("d-flex w-100 align-items-center justify-content-between")
          .appendTo(listItem);

        var name = $("<strong>")
          .addClass("mb-1")
          .text(result.name)
          .appendTo(contentContainer);

        var city = $("<small>").text(result.il_adi).appendTo(contentContainer);

        var details = $("<div>")
          .addClass("col-10 mb-1 small")
          .appendTo(listItem);

        $("<p style='font-size:14px;'>")
          .html(
            "<br><strong>Adres:</strong> " +
            result.address +
            "<br><br><strong>Telefon:</strong> " +
            result.phone +
            "<br><strong>Email:</strong> " +
            result.email
          )
          .appendTo(details);

        listItem.appendTo(sidebar);

        $(`.city[id='${result.plaka_kodu}']`).addClass("selected");
      });
    }
  }


function hohogo(results) {
  var sidebar = $("#results-list");
  sidebar.empty();

  if (results.length === 0) {
    sidebar.append("<li>Arama sonucu bulunamadı.</li>");
  } else {
    $.each(results, function (index, result) {
      var listItem = $("<li>")
        .addClass("list-group-item list-group-item-action py-3 lh-sm")
        .attr("aria-current", "true");

      var contentContainer = $("<div>")
        .addClass("d-flex w-100 align-items-center justify-content-between")
        .appendTo(listItem);

      var name = $("<strong>")
        .addClass("mb-1")
        .text(result.name)
        .appendTo(contentContainer);

      var city = $("<small>").text(result.il_adi).appendTo(contentContainer);

      var details = $("<div>")
        .addClass("col-10 mb-1 small")
        .appendTo(listItem);

      $("<p style='font-size:14px;'>")
        .html(
          "<br><strong>Adres:</strong> " +
          result.address +
          "<br><br><strong>Telefon:</strong> " +
          result.phone +
          "<br><strong>Email:</strong> " +
          result.email +
          "<br><button class=\"btn btn-danger\" id=\"jsonDataRemove\">Veriyi yok et!</button>"
          
        )
        .appendTo(details);

      listItem.appendTo(sidebar);

      $(`.city[id='${result.plaka_kodu}']`).addClass("selected");
    });
  }
}
});


function resetSelected() {
  $(".city").removeClass("selected");
}

function showSidebar() {
  $(".yoa382").css("visibility", "visible");
}
function filterAdminDataRemoval() {
  $(".yoa382").css("display", "block");
}
function hideSidebar() {
  $(".yoa382").css("visibility", "hidden");
}

var svgTurkeyMap = document
  .getElementById("svg-turkey-map")
  .getElementsByTagName("path");
var cityName = document.getElementById("city-name");

for (i = 0; i < svgTurkeyMap.length; i++) {
  svgTurkeyMap[i].addEventListener("mousemove", function () {
    cityName.classList.add("show-city-name--active");
    cityName.style.left = event.clientX + 10 + "px";
    cityName.style.top = event.clientY + 10 + "px";
    cityName.innerHTML = this.getAttribute("title");
  });

  svgTurkeyMap[i].addEventListener("mouseleave", function () {
    cityName.classList.remove("show-city-name--active");
  });

  /*
  svgTurkeyMap[i].addEventListener("click", function() {
    window.location.href = this.getAttribute("#");        
  });
  */
}

$(function () {
  const ilSelect = $("#il-select");

  $.getJSON("/public/json/citydata-turkey.json", function (data) {
    const iller = data.iller;
    const combolistSecenekleri = iller.map((il) => {
      return { value: il.plaka_kodu, textContent: il.il_adi };
    });

    combolistSecenekleri.forEach((secenek) => {
      const option = $("<option>").val(secenek.value).text(secenek.textContent);
      ilSelect.append(option);
    });
  }).fail(function () {
    console.error("JSON verisi alınamadı.");
  });
});

function selectCity() {
  var ilID = this.getAttribute("id");
  var ilSelect = document.getElementById("il-select");
  ilSelect.value = ilID;
  ilSelect.dispatchEvent(new Event("change"));

  var selectedCity = document.querySelector(".city.selected");

  if (selectedCity) {
    selectedCity.classList.remove("selected");
  }

  this.classList.add("selected");
}

var ilSelect = document.getElementById("il-select");
ilSelect.addEventListener("change", function () {
  var selectedCity = document.querySelector(".city.selected");

  if (selectedCity) {
    selectedCity.classList.remove("selected");
  }

  var selectedOption = this.options[this.selectedIndex];
  var selectedCityID = selectedOption.value;

  if (selectedCityID) {
    var selectedCitySVG = document.querySelector(
      'path[id="' + selectedCityID + '"]'
    );

    if (selectedCitySVG) {
      selectedCitySVG.classList.add("selected");
    }
  }
});

var ilElements = document.querySelectorAll(".city");
ilElements.forEach(function (ilElement) {
  ilElement.addEventListener("click", selectCity);
});
