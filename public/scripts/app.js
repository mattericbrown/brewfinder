console.log("sanity check");
var template;
var $locations;
var map;
var allLocations = [];


$(document).ready(function() {
  $locations = $('#locations');
  var source = $('#location-template').html();
  template = Handlebars.compile(source);

  $.ajax({
      method: 'GET',
      url: '/api/locations',
      dataType: 'json',
      success: handleSuccess,
    });

  $('#locationForm').on('submit', function(e){
    e.preventDefault();
    console.log("Submit Clicked...");
    $.ajax({
      method: 'POST',
      url: '/api/locations',
      data: $(this).serialize(),
      success: newLocationSuccess
    });
    $('#locationForm input').val('');

  });

  $locations.on('click', '.deleteBtn', function() {
    console.log($(this).attr('data-id'));
    $.ajax({
      method: 'DELETE',
      url:'/api/locations/' + $(this).attr('data-id'),
      success: deleteLocationSuccess
    });
  });

  $locations.on('click', '.edit-location', handleLocationEditClick);

initializeMap();
});

function handleSuccess(json){
  $locations.empty();
  var locations = json;
  locations.forEach(function(location){
    renderLocation(location);

  });
}

function newLocationSuccess(json){
  var location = json;
  renderLocation(location);

}

// takes ONE single location and renders it to the page
function renderLocation(location) {

    var html = template(location);
    $locations.append(html);

    var marker = new google.maps.Marker({
      position: {lat: location.lat, lng: location.long},
      map:map,
      title: location.name,
      icon: 'http://i.imgur.com/JJuKVOu.png'
    });

}


function handleError(){
  console.log('error loading locations');
}

function deleteLocationSuccess(json) {
  var location = json;
  var deletedLocationId = location._id;
  $('div[data-location-id='+ deletedLocationId + ']').remove();
}


function handleLocationEditClick(data) {
  var $edit = $(this).closest(".beer-location");
  //var $locationRow = $('[data-location-id=' +edit +']');
  var locationId = $edit.data("location-id");
  console.log('edit location', locationId);
  var locationName = $edit.find('span.location-name').text();
  //$edit.find('span.location-name').html('<')

  // var data = {
  //   name: $locationRow.find('.')
  // }
    $.ajax({
      method: 'PUT',
      url:'/api/locations/' + locationId,
      success: saveLocationEditClick
    });



  // console.log('response to update', data);
  // var locationId = data._id;
  // $('[data-location-id=' +locationId +']').remove();
}

navigator.geolocation.getCurrentPosition(function(position) {
 var marker = new google.maps.Marker({
   position: {lat:position.coords.latitude, lng:position.coords.longitude},
   map: map,
   title: "You are here",
   icon: 'http://i.imgur.com/zBvcK4r.png'
 });
});

function initializeMap() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
      center: {lat: 37.77, lng: -122.45},
      zoom: 13
  });
}
