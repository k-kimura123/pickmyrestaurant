//Store user input in session
function getInput(){
    sessionStorage.setItem("keyword",document.getElementById("keyword").value);
    sessionStorage.setItem("MaxPrice",document.getElementById("price").value);
    sessionStorage.setItem("Rating",document.getElementById("rating").value);
    sessionStorage.setItem("Distance",document.getElementById("distance").value*1000);
    window.location.href="yourRestaurants.html";
}


//function rangeOutputDistance(){
//    distance.value = parseFloat(distance.value).toFixed(2);
//    range_weight_disp_distance.value = distance.value;
//}