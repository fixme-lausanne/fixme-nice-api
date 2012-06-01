function updateSpaceInformation() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://fixme.ch/cgi-bin/spaceapi.py", true);

    xhr.onreadystatechange = function(){

      if ( xhr.readyState == 4 ) {

        parse_text = jsonParse(xhr.responseText);

        if ( xhr.status == 200 ) {
            isOpen = parse_text.open;
            closeBlock = document.getElementById("close-block");
            openBlock = document.getElementById("open-block");
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

var baseUrl = ""
//TODO get twitter url
function openSpace() {
    var hoursOpen = document.hoursform.hours.value;
    var hoursOpen = Math.floor(hoursOpen);
    if (isNaN(hoursOpen) || hoursOpen < 0) {
        //TODO early return or throw exception
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
    requestObject.send(null);
}

