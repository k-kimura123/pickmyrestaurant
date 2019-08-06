let map;
let myLocation = {};

//Initialize map with User's location as center
function initMap(){
    const loadMyLocation = new Promise((resolve)=>{
        markerInfo = new google.maps.InfoWindow;
        myLocationLabel = new google.maps.InfoWindow;
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function(p){
                myLocation.lat = p.coords.latitude;
                myLocation.lng = p.coords.longitude;
                map = new google.maps.Map(document.getElementById('map'), {
                    center: myLocation,
                    zoom: 12,
                });
                myLocationLabel.setPosition(myLocation);
                myLocationLabel.setContent('Your location'); 
                myLocationLabel.open(map);
                resolve([map,myLocation]);
            },function(){handleError("geolocation service not available");},{timeout: 5000,});
        }
        else{handleError('No geolocation available')}
    });  
    loadMyLocation.then((mapLocation)=>{
        return findNearMe(mapLocation);
    })
}

function handleError(errormsg){
    alert(errormsg);
}

function createMarker(place) {
    let marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
      markerInfo.setContent(place.name);
      markerInfo.open(map, this);
    });
}

//Filter search restaurants near User and pass the restaurant array to the filter array callback function
function findNearMe(MapAndLocation){
    let nearRestaurants = new google.maps.places.PlacesService(map);
    let restaurantArray =[];
    console.log(MapAndLocation);
    map = MapAndLocation[0];
    myLocation = MapAndLocation[1];
    nearRestaurants.nearbySearch({
        location: myLocation,
        radius: [sessionStorage.getItem("Distance")],
        type: ['restaurant'],
        keyword: [sessionStorage.getItem("keyword")],
        maxPriceLevel: [sessionStorage.getItem("MaxPrice")],
        open_now: true,
    },function(results,status,pagination){
        if(status === google.maps.places.PlacesServiceStatus.OK && results.length != 0){
            if(pagination.hasNextPage){
                for(let i = 0; i < results.length; i++){
                    restaurantArray.push(results[i]);
                    createMarker(results[i]);
                }
                pagination.nextPage();
            }
            else if(!pagination.hasNextPage) {
                for(let i = 0; i < results.length; i++){
                    restaurantArray.push(results[i]);
                    createMarker(results[i]);
                }
                console.log(restaurantArray);
                return filterArray(restaurantArray);
            } 
        }
        else if(results.length == 0){
            alert("Couldn't find a restaurant! Try widening your search");
            window.location.href = "index.html";
        }
        else {
            alert("Geolocation service not available");
            window.location.href = "index.html";
        }
    });
}

//Filter the restaurant rray further by rating then randomly pick up to 3 restaurants from array
function filterArray(array){
    let randomArray = [];
    let random;
    let filteredArray = array.filter((restaurant)=>{
        return restaurant.rating >= sessionStorage.getItem("Rating");
        });
    console.log(filteredArray);
    if(filteredArray.length>3){
        for(let i=0;i<3;i++){
            random = filteredArray[Math.floor(Math.random()*filteredArray.length)];
            randomArray.push(random);
            filteredArray.splice(filteredArray.indexOf(random),1);
        }
    }
    else if(filteredArray.length == 0){
        alert("Couldn't find a restaurant! Try widening your search");
        window.location.href = "index.html";
    }
    else{randomArray = filteredArray}
    console.log(randomArray);
    return showArray(randomArray);
} 

//Display filtered restaurants in carousel slide
function showArray(finalArray){
    
    let newdiv;
    let newimage;
    let imagename;
    let rating;
    let price;
    let gmapslink;
    let j=5;
    let imagesBox = document.getElementById('images');
    let imageslide = document.getElementById('carousel-inner');

    
    for(let i=0;i<finalArray.length;i++,j++){
        newdiv = document.createElement('div');
        newimage = document.createElement('img');
        imagename = document.createElement("h2");
        rating = document.createElement("p");
        price = document.createElement("p");
        
        //Create carousel
        newimage.src = finalArray[i].photos[0].getUrl({maxWidth:500,maxHeight:500});
        imageslide.innerHTML +='<div class="carousel-item"><img src="'+newimage.src+'"class="img text-center"><div id="'+i+'" class="carousel-caption caption visible text-light font-weight-bolder"></div></div>';
        imageslide.firstElementChild.classList.add("active");

        //Image Captions
        imagename.innerHTML =`${finalArray[i].name}`;
        rating.innerHTML = `Rating: ${finalArray[i].rating} out of 5`;
        price.innerHTML = `Price: ${finalArray[i].price_level} out of 4`;
        gmapslink = document.createElement('a');
        gmapslink.setAttribute('href',`https://www.google.com/maps/search/?api=1&query=${finalArray[i].name}&query_place_id=${finalArray[i].place_id}`);
        gmapslink.classList.add("yellow");
        document.getElementById(i).appendChild(gmapslink).appendChild(imagename);
        document.getElementById(i).appendChild(rating);
        document.getElementById(i).appendChild(price);
        
    }
     
}