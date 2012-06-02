function onPageLoad() {
    //add the refresh every 5 minutes
    updateSpaceInformation
}

function updateSpaceInformation() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://fixme.ch/cgi-bin/spaceapi.py", true);

    xhr.onreadystatechange = function() {

      if ( xhr.readyState == 4 ) {
        try {
            var parsed_text = jsonParse(xhr.responseText);
        } catch (err) {
            //json parsing failed
            document.body.innerHTML = "ERROR";
            return
        }
        if ( xhr.status == 200 ) {
            var isOpen = parsed_text.open;
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

          document.body.innerHTML = "ERROR";

        }

      }

    };

    xhr.send(null);
}

var baseUrl = "https://fixme.ch/cgi-bin/twitter.pl"
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

