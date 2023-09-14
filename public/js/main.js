$(document).ready(function () {
  // Function to read a JSON file and display the data count
  function displayDataCount(filename, countElement) {
    return $.getJSON(`json/${filename}`)
      .then(function (data) {
        console.log("Data fetched:", data); // Add this line for debugging
        const count = data.centers.length; // Access the length of the 'centers' array
        console.log("Count:", count); // Add this line for debugging
        countElement.text(count);
        return count; // Return the count for Promise.all()
      })
      .catch(function (error) {
        console.error(error);
        countElement.text("ERR");
        return 0; // Return 0 to handle the error in Promise.all()
      });
  }
  displayDataCount("konsolosluklar.json", $("#counter1")),
    displayDataCount("okullar.json", $("#counter3")),
    displayDataCount("universiteler.json", $("#counter4")),
    // Call the displayDataCount function for each JSON file
    Promise.all([

      displayDataCount("dernekler.json", $("#counter2")),
      displayDataCount("kulturmerkezleri.json", $("#counter2")),

    ])
      .then(counts => {
        console.log("Counts:", counts);
        const combinedCount = counts.reduce((acc, count) => acc + count, 0);
        console.log("Combined Count:", combinedCount);
        $("#counter2").text(combinedCount);
      })
      .catch(error => {
        console.error(error);
        $("#counter1").text("Error combining counts");
      });
});



function buttonClicked(button) {
  $("button.white-button").removeClass("clicked");
  $(button).addClass("clicked");
}


var modal = null;
var modalHeader = null;
var modalBody = null;

var modal = null;
var modalHeader = null;
var modalBody = null;

function filterResults() {
  var selectedService = $("#hizmet-select").val();
  var selectedButton = $("button.white-button.clicked").val();
  var selectedCity = $("#il-select").val();

  var jsonFileName = "";

  if (selectedService === "1" || selectedButton === "1") {
    jsonFileName = "/ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb";
  } else if (selectedService === "2" || selectedButton === "2") {
    jsonFileName = "/3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d";
  } else if (selectedService === "3" || selectedButton === "3") {
    jsonFileName = "/2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6";
  } else if (selectedService === "4" || selectedButton === "4") {
    jsonFileName = "/18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4";
  } else if (selectedService === "5" || selectedButton === "5") {
    jsonFileName = "/3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea";
  }
  if (jsonFileName) {
    $.getJSON(jsonFileName, function (jsonData) {
      if (jsonData) {
        var sidebar = $(".liste-grup");
        var cities = $('.city');

        sidebar.empty();

        for (var i = 0; i < jsonData.centers.length; i++) {
          var data = jsonData.centers[i];
          if (!selectedCity || data.plaka_kodu === selectedCity) {
            var listItem = $("<a>")
              .addClass("list-group-item list-group-item-action py-3 lh-sm")
              .attr("href", "#")
              .attr("aria-current", "true")
              .data("index", i); // Store the index in data attribute

            var contentContainer = $("<div>")
              .addClass("d-flex w-100 align-items-center justify-content-between")
              .appendTo(listItem);

            var name = $("<strong>")
              .addClass("mb-1")
              .text(data.name)
              .appendTo(contentContainer);

            var city = $("<small>").text(data.il_adi).appendTo(contentContainer);

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

            // Attach click event to open modal
            listItem.on("click", function () {
              var index = $(this).data("index");
              var result = jsonData.centers[index];
              openModal(result);
            });
          }
        }
      }
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.log("JSON dosyası alınamadı. Hata: " + errorThrown);
    });
  }
}

function openModal(result) {
  removeExistingModal();

  modal = document.createElement("div");
  modal.setAttribute("id", "modal");
  modal.setAttribute("class", "modal");
  document.body.appendChild(modal);

  modalHeader = document.createElement("div");
  modalHeader.setAttribute("id", "modal-header");
  modalHeader.setAttribute("style", "color: white !important; font-size: 24px;");
  modal.appendChild(modalHeader);

  modalBody = document.createElement("div");
  modalBody.setAttribute("id", "modal-body");
  modalBody.setAttribute("style", "color: white !important; font-size: 16px;");
  modal.appendChild(modalBody);

  modal.style.position = "fixed";
  modal.style.left = "50%";
  modal.style.top = "50%";
  modal.style.transform = "translate(-50%, -50%)";

  modal.style.height = "600px";
  modal.style.display = "block";

  modalHeader.innerHTML = result.name;
  modalBody.innerHTML = `
    <p>
      <strong>Address:</strong> ${result.address}
      <br><strong>Phone:</strong> ${result.phone}
      <br><strong>Email:</strong> ${result.email}
      <br>${result.aciklama}
    </p>
  `;

  var closeButton = document.createElement("span");
  closeButton.className = "close";
  closeButton.innerHTML = "&times;";
  closeButton.style.color = "white";
  modalHeader.appendChild(closeButton);

  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function removeExistingModal() {
  if (modal) {
    document.body.removeChild(modal);
    modalHeader = null;
    modalBody = null;
    modal = null;
  }
}





 


$(document).ready(function () {
  var jsonFiles = [
    { url: "/ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb", searchField: "name" },
    { url: "/3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d", searchField: "name" },
    { url: "/2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6", searchField: "name" },
    { url: "/18ac3e7343f016890c510e93f935261169d9e3f565436429830faf0934f4f8e4", searchField: "name" },
    { url: "/3f79bb7b435b05321651daefd374cdc681dc06faa65e374e38337b88ca046dea", searchField: "name" }
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
          
          }
        }
      }).fail(function (hataatis) {
        console.log("JSON dosyası alınamadı. Hata: " + hataatis);
      });
    });
  }
 

  var modal = document.getElementById("#ModalBody");

  var modal = null;
var modalHeader = null;
var modalBody = null;

function displayResults(results) {
  var sidebar = $("#results-list");
  sidebar.empty();

  if (results.length === 0) {
    sidebar.append("<li>Arama sonucu bulunamadı.</li>");
  } else {
    var listItems = [];
    for (var i = 0; i < results.length; i++) {
      var listItem = $("<li>")
        .addClass("list-group-item list-group-item-action py-3 lh-sm")
        .attr("aria-current", "true")
        .data("index", i) // Store the index in data attribute

      var contentContainer = $("<div>")
        .addClass("d-flex w-100 align-items-center justify-content-between")
        .appendTo(listItem);

      var name = $("<strong>")
        .addClass("mb-1")
        .text(results[i].name)
        .appendTo(contentContainer);

      var city = $("<small>").text(results[i].il_adi).appendTo(contentContainer);

      var details = $("<div>")
        .addClass("col-10 mb-1 small")
        .appendTo(listItem);

      $("<p style='font-size:15px;'>")
        .html(
          "<br><strong>Adres:</strong> " +
            results[i].address +
            "<br><strong>Telefon:</strong> " +
            results[i].phone +
            "<br><strong>Email:</strong> " +
            results[i].email
        )
        .appendTo(details);

      listItems.push(listItem);
    }

    sidebar.append(listItems);

    $(".list-group-item").on("click", function () {
      var index = $(this).data("index"); // Retrieve the stored index
      var result = results[index];
      openModal(result);
    });
  }
}

function openModal(result) {
  removeExistingModal();

  modal = document.createElement("div");
  modal.setAttribute("id", "modal");
  modal.setAttribute("class", "modal");
  document.body.appendChild(modal);

  modalHeader = document.createElement("div");
  modalHeader.setAttribute("id", "modal-header");
  modalHeader.setAttribute("style", "color: white !important; font-size: 30px;");
  modal.appendChild(modalHeader);

  modalBody = document.createElement("div");
  modalBody.setAttribute("id", "modal-body");
  modalHeader.setAttribute("style", "color: white !important; font-size: 19px;");
  modal.appendChild(modalBody);

  modal.style.position = "fixed";
  modal.style.left = "50%";
  modal.style.top = "50%";
  modal.style.transform = "translate(-50%, -50%)";
 
  modal.style.height = "600px";
  modal.style.display = "block";

  modalHeader.innerHTML = result.name;
  modalBody.innerHTML = `
    <p>
      <strong>Adres:</strong> ${result.address}
      <br><strong>Telefon:</strong> ${result.phone}
      <br><strong>Email:</strong> ${result.email}
      <br><br><strong>Information:</strong>${result.aciklama}
    </p>
  `;

  var closeButton = document.createElement("span");
  closeButton.className = "close";
  closeButton.innerHTML = "&times;";
  closeButton.style.color = "white";
  modalHeader.appendChild(closeButton);

  closeButton.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

function removeExistingModal() {
  if (modal) {
    document.body.removeChild(modal);
    modalHeader = null;
    modalBody = null;
    modal = null;
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



$(function () {
  const ilSelect = $("#il-select");

  $.getJSON("/citydata", function (data) {
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