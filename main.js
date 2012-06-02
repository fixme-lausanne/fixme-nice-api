function onPageLoad() {
    //TODO add the refresh every 5 minutes
    updateSpaceInformation();
}

var apiUrl = "https://fixme.ch/cgi-bin/spaceapi.py";
function updateSpaceInformation() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://fixme.ch/cgi-bin/spaceapi.py", true);

    xhr.onreadystatechange = function() {

      if ( xhr.readyState == 4) {
        if (xhr.status == 200) {
            try {
                var parsed_text = jsonParse(xhr.responseText);
                var isOpen = parsed_text.open;
            } catch (err) {
                //json parsing failed or doesn't contain the correct element
                displayError();
                return;
            }
            var closeBlock = document.getElementById("close-block");
            var openBlock = document.getElementById("open-block");
            if (isOpen) {
                openBlock.style.visibility = "hidden";
                closeBlock.style.visibility = "visible";
            } else {
                openBlock.style.visibility = "visible";
                closeBlock.style.visibility = "hidden";
            }
        } else {
            displayError();
        }
      }
    };
    xhr.send(null);
}

function displayError() {
    document.body.innerHTML = "ERROR";
}

var baseUrl = "https://fixme.ch/cgi-bin/twitter.pl";
function openSpace() {
    var hoursForm = document.hoursform.hours;
    var hoursOpen = hoursForm.value;
    var hoursOpen = Math.floor(hoursOpen);
    if (isNaN(hoursOpen) || hoursOpen < 1) {
        alert("Please input a valid number of hours");
        hoursForm.value = "";
        return;
    }
    var requestUrl = baseUrl + "?do=custom&hours=" + hoursOpen;
    var requestObject = new XMLHttpRequest();
    requestObject.open("GET", requestUrl, true);
    requestObject.send(null);
}

function closeSpace() {
    var requestUrl = baseUrl + "?do=close";
    var requestObject = new XMLHttpRequest();
    requestObject.open("GET", requestUrl, true);
    requestObject.onreadystatechange = function() {
        if (requestObject.readyState == 4) {
            alert("Request sent");
        }
    }
    requestObject.send(null);
}

