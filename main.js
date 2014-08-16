/*jslint  browser:true*/
/*global  jsonParse*/
/*global  confirm*/

var closing_time;
var url_twitter = "https://fixme.ch/cgi-bin/twitter.pl";
var url_api = "https://fixme.ch/status.json";
var url_led = "http://led.fixme.ch/rgb/";

var updateBlock=  $("#update-block");
var msgBlock   =  $("#msg-block");
var loadBlock  =  $("#loading-block");
var closeBlock =  $("#close-block");
var openBlock  =  $("#open-block");
var slider     =  $("#breathSlider");

function displayError(err) {
    "use strict";
    loadBlock.hide();
    msgBlock.text("Error connecting to fixme server: "+ err);
}

function checkHours() {
    var hoursForm = $('#hours');
    var hoursOpen = Math.floor(hoursForm.val());
    var openButton = $('#btn-open');
    if (isNaN(hoursOpen) || hoursOpen < 1) {
        openButton.attr('disabled', 'disabled');
    } else {
        openButton.removeAttr('disabled');
    }
}

function changeHour(inc) {
    "use strict";
    var hours = $("#hours");
    if (inc) {
        hours.val(parseInt(hours.val(), 10) + 1);
    } else if (hours.val() > 1) {
        hours.val(parseInt(hours.val(), 10) - 1);
    }
    checkHours();
}

function pad(n) {
    return ("0" + n).slice(-2);
}

function updateSpaceInformation() {
    "use strict";
    loadBlock.show();

    $.getJSON(url_api, function(data){
        var isOpen = data.state.open;
        var open_duration = data.state.ext_duration;
        closing_time = new Date(data.state.lastchange * 1000);
        closing_time.setHours(closing_time.getHours() + open_duration);
        update_date(calcDiff(closing_time))

        if (isOpen) {
            openBlock.hide();
            closeBlock.show();
        } else {
            openBlock.show();
            closeBlock.hide();
            document.hoursform.hours.focus();
        }
        updateBlock.html('Last update:<br/>'
            + closing_time.toDateString()
            + ' ' + pad(closing_time.getHours())
            + ':' + pad(closing_time.getMinutes()));
        msgBlock.html(data.state.message);
        loadBlock.hide();
        checkHours();
    });
}

function calcDiff() {
    if(closing_time == undefined) return new Date(0);
    var diff_time = Number(closing_time.getTime()) - new Date().getTime();
    if (diff_time > 0) {
        return new Date(diff_time);
    } else {
        return new Date(0);
    }
}

function launchAutoRefresh() {
  setInterval(function () {
    update_date(calcDiff(closing_time))
  }, 300);
}

function openSpace(extend) {
    "use strict";
    var hoursOpen = document.hoursform.hours.value;
    if (hoursOpen === undefined || extend) {
        hoursOpen = prompt("Hours:", 1);
        if (hoursOpen === null) return;
    }
    var confirm_return = confirm("Are you sure you want to open the hackerspace ?");
    if (confirm_return) {
        msgBlock.html("Opening space...");
        var requestUrl = url_twitter + "?do=custom&hours=" + hoursOpen,
            requestObject = new XMLHttpRequest();
        $.ajax(requestUrl, {
            type: 'GET',
            complete: function(data){
                msgBlock.html(data.responseText);
            },
        });
    }
}

function closeSpace() {
    "use strict";
    var confirm_value = confirm("Are you sure you want to close the space ?");
    if (!confirm_value) {
        return;
    }
    msgBlock.text("Closing space...");
    var requestUrl = url_twitter + "?do=close";
    $.ajax(requestUrl, {
        type: 'GET',
        complete: function(data){
            msgBlock.html(data.responseText);
        },
    });
}

function update_date(date) {
    "use strict";
    var hours = String(date.getHours() - 1); // Time Zone GMT-1
    if (hours.length == 1) {
        hours = "0" + hours;
    }
    $("#hour").text(hours);

    var minutes = String(date.getMinutes());
    if (minutes.length == 1) {
        minutes = "0" + minutes;
    }
    $("#minute").text(minutes);

    var seconds = String(date.getSeconds());
    if (seconds.length == 1) {
        seconds = "0" + seconds;
    }
    $("#second").text(seconds);
}

function switchTheLight(red, green, blue) {
    $.ajax(url_led, {
        type: 'POST',
        data: {red: red, green: green, blue: blue, breathe: slider.val()},
    });
}

function changeBreathSpeed(){
    $('#breathValue').text(slider.val() + ' ms');
}

function setTheBreathSpeed() {
    $.ajax(url_led, {
        type: 'POST',
        data: {breathe: slider.val().substring(0, -3)},
    });
}

function switchTheLightColor(color) {
    Police.switchOff();
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
    switchTheLight(255, 255, 255);
}

function switchTheLightOff() {
    "set strict";
    Police.switchOff();
    switchTheLight(0, 0, 0);
}

function switchTheLightToPolice() {
    Police.switchOn()
}

var Police = {
    policeEvent: 0,
    delay: 100,
    switchOff: function switchOff() {
        window.clearInterval(Police.policeEvent)
    },
    switchOn: function switchOn(red) {
        if (red) {
            switchTheLight(255, 0, 0);
        } else {
            switchTheLight(0, 0, 255);
        }
        Police.policeEvent = window.setTimeout(function() { Police.switchOn(!red)}, Police.delay)
    },
};

$(document).ready(function(){

    msgBlock.show();
    updateBlock.show();

    "use strict";
    // Leds buttons
    $('#btn-red').click(function(){ switchTheLightColor('red'); });
    $('#btn-green').click(function(){ switchTheLightColor('green'); });
    $('#btn-blue').click(function(){ switchTheLightColor('blue'); });
    $('#btn-white').click(function(){ switchTheLightOn() ; });
    $('#btn-off').click(function(){ switchTheLightOff(); });
    $('#btn-police').click(function(){ switchTheLightToPolice(); });
    $('#breathSlider').change(function(){ changeBreathSpeed(); });
    $('#breathSlider').mouseup(function(){ setTheBreathSpeed(); });

    // Open/Close buttons
    $('#btn-minus').click(function(){ changeHour(0); });
    $('#btn-plus').click(function(){ changeHour(1); });
    $('#btn-open').click(function(){ openSpace(); });
    $('#btn-extend').click(function(){ openSpace(1); });
    $('#btn-close').click(function(){ closeSpace(); });
    $('#hours').keyup(function(){ checkHours(); });

    // Set up trigger
    launchAutoRefresh();
    updateSpaceInformation();
    setInterval(updateSpaceInformation, 60 * 1000);

    // Egging
    var konami = new Konami();
    konami.load("https://www.youtube.com/watch?v=1Wytn-_MSBo");
});

