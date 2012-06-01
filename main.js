    <script language="javascript">

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://fixme.ch/cgi-bin/spaceapi.py", true);

    xhr.onreadystatechange = function(){

      if ( xhr.readyState == 4 ) {

        parse_text = jsonParse(xhr.responseText);

        if ( xhr.status == 200 ) {

          document.body.innerHTML = parse_text.status;

        } else {

          document.body.innerHTML = "ERROR";

        }

      }

    };

    xhr.send(null);

    function openSpace(hoursOpen) {
        hoursOpen = Math.floor(hoursOpen);
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

    </script>
