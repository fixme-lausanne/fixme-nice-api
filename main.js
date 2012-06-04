function onPageLoad() {
    //TODO add the refresh every 5 minutes
    updateSpaceInformation();
    refresh_counter = setTimeout("onPageLoad()", 5 * 60 *1000);
}

var apiUrl = "https://fixme.ch/cgi-bin/spaceapi.py";
function updateSpaceInformation() {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", apiUrl, true);

    xhr.onreadystatechange = function() {

      if ( xhr.readyState == 4) {
        if (xhr.status == 200) {
            try {
                var parsed_text = jsonParse(xhr.responseText);
                var isOpen = parsed_text.open;
                var open_duration = parsed_text.duration;
                var closing_time = new Date(Number(parsed_text.lastchange) * 1000)
                closing_time.setHours(closing_time.getHours() + open_duration);
            } catch (err) {
                //json parsing failed or doesn't contain the correct element
                alert(err);
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
            var diff_time = Number(closing_time.getTime()) - new Date().getTime();
            if (diff_time > 0) {
                update_date(new Date(diff_time));
            } else {
                update_date(new Date(0));
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

function update_date(date) {
    var hours = String(date.getHours() - 1);
    if (hours.length == 1) {
        hours = "0" + hours;
    }
    var first_char = hours.charAt(0);
    document.getElementById("first-hour").innerText = first_char;
    var second_char = hours.charAt(1);
    document.getElementById("second-hour").innerText = second_char;

    var minutes = String(date.getMinutes());
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    var first_char = minutes.charAt(0);
    document.getElementById("first-minute").innerText = first_char;
    var second_char = minutes.charAt(1);
    document.getElementById("second-minute").innerText = first_char;
}
