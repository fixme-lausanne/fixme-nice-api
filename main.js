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

    </script>