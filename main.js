/*jslint  browser:true*/
/*global  jsonParse*/
/*global  confirm*/

var msgBlock   =  document.getElementById("msg-block");
var loadBlock  =  document.getElementById("loading-block");
var closeBlock =  document.getElementById("close-block");
var openBlock  =  document.getElementById("open-block");
var slider	   =  document.getElementById("breathSlider")

function toggleDiv(div, show) {
    "use strict";
    if (show) {
        div.style.visibility = "visible";
        div.style.overflow = "none";
        div.style.height = "auto";
    } else {
        div.style.visibility = "hidden";
        div.style.overflow = "hidden";
        div.style.height = "0px";
    }
}

function displayError() {
    "use strict";
    msgBlock.style.background = "red";
    msgBlock.innerHTML = "Error connecting to fixme server";
}

var baseUrl = "https://fixme.ch/cgi-bin/twitter.pl";
function checkHours(hoursForm) {
    "use strict";
    var hoursOpen = hoursForm.value,
        formParent = hoursForm.parentElement,
        openButton = formParent.openbutton;
    hoursOpen = Math.floor(hoursOpen);
    //TODO throw error if parentElement is null
    if (openButton == null) {
        alert("The page was malformed, you should reload it now.")
    }
    if (isNaN(hoursOpen) || hoursOpen < 1) {
        openButton.disabled = true;
    } else {
        openButton.disabled = false;
    }
}

function changeHour(inc) {
    "use strict";
    var val = document.getElementById("hours");
    if (inc) {
        val.value = parseInt(val.value, 10) + 1;
    } else if (val.value > 1) {
        val.value = parseInt(val.value, 10) - 1;
    }
    checkHours(val);
}

var apiUrl = "https://fixme.ch/cgi-bin/spaceapi.py";
function updateSpaceInformation() {
    "use strict";
    toggleDiv(msgBlock, 0);
    toggleDiv(loadBlock, 1);

    var xhr = new XMLHttpRequest();

    xhr.open("GET", apiUrl, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var parsed_text = jsonParse(xhr.responseText),
                        isOpen = parsed_text.open,
                        open_duration = parsed_text.duration,
                        closing_time = new Date(Number(parsed_text.lastchange) * 1000);
                    closing_time.setHours(closing_time.getHours() + open_duration);
                } catch (err) {
                    /*json parsing failed or doesn't contain the correct element
                    alert(err);*/
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

function onPageLoad() {
    "use strict";
    toggleDiv(openBlock, 0);
    toggleDiv(closeBlock, 0);
    toggleDiv(msgBlock, 0);
    updateSpaceInformation();
    setInterval(onPageLoad, 60 * 1000);
    checkHours(document.getElementById("hours"));
}


function openSpace(hoursOpen) {
    "use strict";
    if (hoursOpen === undefined) {
        var hoursForm = document.hoursform.hours;
        hoursOpen = hoursForm.value;
    }
    var confirm_return = confirm("Are you sure you want to open the hackerspace ?");
    if (confirm_return) {
        msgBlock.innerHTML = "Opening space...";
        var requestUrl = baseUrl + "?do=custom&hours=" + hoursOpen,
            requestObject = new XMLHttpRequest();
        requestObject.open("GET", requestUrl, true);
        requestObject.onreadystatechange = function () {
            if (requestObject.readyState === 4) {
                if (requestObject.status === 200) {
                    msgBlock.innerHTML = requestObject.responseText;
                }
            }
        }
        requestObject.send(null);
    }
}

function promptOpenSpace(){
    "use strict";
    var hours = prompt("Hours:", 1);
    openSpace(hours);
}

function closeSpace() {
    "use strict";
    var requestUrl = baseUrl + "?do=close";
    var requestObject = new XMLHttpRequest();
    var confirm_value = confirm("Are you sure you want to close the space ?");
    if (!confirm_value) {
        return;
    }
    msgBlock.innerHTML = "Closing space...";
    requestObject.open("GET", requestUrl, true);
    requestObject.onreadystatechange = function() {
        if (requestObject.readyState == 4) {
            if (requestObject.status == 200) {
                msgBlock.innerHTML = requestObject.responseText;
            }
        }
    }
    requestObject.send(null);
}

function update_date(date) {

    "use strict";
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
    "use strict";
    if(document.all){
         document.getElementById(id).innerText = text;
    } else{
        document.getElementById(id).textContent = text;
    }
}

function switchTheLight(red, green, blue) {
    "set strict";
	var breathValue = slider.value;
    var requestUrl = "http://led.fixme.ch/rgb/";
    var requestObject = new XMLHttpRequest();
    requestObject.open("POST", requestUrl, true);
    requestObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestObject.send("red=" + red + "&green=" + green + "&blue=" + blue + "&breath=" + breathValue);
}

function setTheBreathSpeed() {
    "set strict";
	var breathValue = slider.value;
    var requestUrl = "http://led.fixme.ch/rgb/";
    var requestObject = new XMLHttpRequest();
    requestObject.open("POST", requestUrl, true);
    requestObject.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestObject.send("breath=" + breathValue);
    document.getElementById("breathValue").innerText = breathValue;
}

function switchTheLightColor(color) {
	Police.switchOff()
    switch(color) {
        case 'red':
            switchTheLight(255, 0, 0)
            break;
        case 'green':
            switchTheLight(0, 255, 0)
            break;
        case 'blue':
            switchTheLight(0, 0, 255)
            break;
    }
}

function switchTheLightOn() {
    "set strict";
  switchTheLight(255, 255, 255)
}

function switchTheLightOff() {
  "set strict";
  Police.switchOff()
  switchTheLight(0, 0, 0)
}

function switchTheLightToPolice() {
	Police.switchOn()
}

function Police(){};
Police.policeEvent = 0;
Police.delay = 100;

Police.switchOff = function switchOff() {
	window.clearInterval(Police.policeEvent)
}

Police.switchOn = function switchOn(red) {
	if (red) {
		switchTheLight(255, 0, 0);
	} else {
		switchTheLight(0, 0, 255);
	}
	Police.policeEvent = window.setTimeout(function() { Police.switchOn(!red)}, Police.delay)
}

