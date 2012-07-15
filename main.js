var msgBlock   =  document.getElementById("msg-block");
var loadBlock  =  document.getElementById("loading-block");
var closeBlock =  document.getElementById("close-block");
var openBlock  =  document.getElementById("open-block");

function onPageLoad() {
    toggleDiv(openBlock, 0);
    toggleDiv(closeBlock, 0);
    toggleDiv(msgBlock, 0);
    updateSpaceInformation();
    refresh_counter = setTimeout("onPageLoad()", 60 *1000);
    checkHours(document.getElementById("hours"));
}

function changeHour(inc) {
    var val = document.getElementById("hours");
    if (inc) {
        val.value = (val.value-0) + 1;
    } else if((val.value-0)>1) {
        val.value = (val.value-0) - 1;
    }
    checkHours(val);
}

var apiUrl = "https://fixme.ch/cgi-bin/spaceapi.py";
function updateSpaceInformation() {
    toggleDiv(msgBlock, 0);
    toggleDiv(loadBlock, 1);

    var xhr = new XMLHttpRequest();

    xhr.open("GET", apiUrl, true);

    xhr.onreadystatechange = function() {

      if ( xhr.readyState == 4) {
        if (xhr.status == 200) {
            try {
                var parsed_text = jsonParse(xhr.responseText);
                var isOpen = parsed_text.open;
                var open_duration = parsed_text.duration;
                var closing_time = new Date(Number(parsed_text.lastchange) * 1000);
                closing_time.setHours(closing_time.getHours() + open_duration);
            } catch (err) {
                //json parsing failed or doesn't contain the correct element
                alert(err);
                displayError();
                return;
            }
            if (isOpen) {
                toggleDiv(openBlock, 0);
                toggleDiv(closeBlock, 1);
            } else {
                toggleDiv(openBlock, 1);
                toggleDiv(closeBlock, 0);
                document.hoursform.hours.focus();
            }
            var diff_time = Number(closing_time.getTime()) - new Date().getTime();
            if (diff_time > 0) {
                update_date(new Date(diff_time));
            } else {
                update_date(new Date(0));
            }
            msgBlock.innerHTML = parsed_text.status;
            toggleDiv(msgBlock, 1);
            toggleDiv(loadBlock, 0);
        } else {
            displayError();
        }
      }
    };
    xhr.send(null);
}

function toggleDiv(div, show){
    if (show) {
        div.style.visibility = "visible";
        div.style.height = "auto";
    } else {
        div.style.visibility = "hidden";
        div.style.height = "0px";
    }
}

function displayError() {
    document.body.style.background = "red";
    document.body.innerHTML = "Error connecting to fixme server";
}

var baseUrl = "https://fixme.ch/cgi-bin/twitter.pl";
function checkHours(hoursForm) {
    var hoursOpen = hoursForm.value;
    var hoursOpen = Math.floor(hoursOpen);
    var formParent = hoursForm.parentElement;
    //TODO throw error if parentElement is null
    var openButton = formParent.openbutton;
    if (isNaN(hoursOpen) || hoursOpen < 1) {
        openButton.disabled = true;
    } else {
        openButton.disabled = false;
    }
}

function openSpace() {
    var hoursForm = document.hoursform.hours;
    var hoursOpen = hoursForm.value;
    var confirm_return = confirm("Are you sure you want to open the hackerspace ?");
    if (confirm_return) {
        var requestUrl = baseUrl + "?do=custom&hours=" + hoursOpen;
        var requestObject = new XMLHttpRequest();
        requestObject.open("GET", requestUrl, true);
        requestObject.send(null);
    }
}

function closeSpace() {
    var requestUrl = baseUrl + "?do=close";
    var requestObject = new XMLHttpRequest();
    var confirm_value = confirm("Are you sure you want to close the space ?");
    if (!confirm_value) {
        return;
    }
    requestObject.open("GET", requestUrl, true);
    requestObject.onreadystatechange = function() {
        if (requestObject.readyState == 4) {
            if (request.status == 200) {
                alert("Request was sent correctly.");
            } else {
                alert("Request had an issue, wait a moment then retry please.");
            }
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
    setTextForId("first-hour", first_char);
    var second_char = hours.charAt(1);
    setTextForId("second-hour", second_char);

    var minutes = String(date.getMinutes());
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    var first_char = minutes.charAt(0);
    setTextForId("first-minute", first_char);
    var second_char = minutes.charAt(1);
    setTextForId("second-minute", first_char);
}

function setTextForId(id, text) {
    if(document.all){
         document.getElementById(id).innerText = text;
    } else{
        document.getElementById(id).textContent = text;
    }
}
