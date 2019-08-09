const api_key = "AIzaSyCC23IWj8H1SRcrkIcEHPcbMLfJvXGXgFI";
function loadScript() {
    var API = document.createElement('script');
    API.type = 'text/javascript';
    API.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key='+api_key+'&callback=initMap'; 
    API.defer = true;
    document.body.appendChild(API);
  }
  
  window.onload = loadScript;