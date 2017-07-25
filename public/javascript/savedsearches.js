console.log('We in this bitch');


function getSearches(){
  var searches = $.get('/api/search')
    .done(function(data){
      $.each(data, function(index, search){
        console.log(search.searchMadeBy)
        if (search.searchMadeBy == $('.hidden-id').attr('id')) {
          $('tbody#start').prepend('<tr id="'+ search._id +'"><td>' + search.starting_point + '</td></a>' + '<td>' + search.destination + '</td><td><button type="button" class="editBtn btn btn-info">Edit</button>  <button type="button" class="delBtn btn btn-warning">Delete</button></td></tr>');
        }
      })
    })
}


// Define function that will get executed when the checkbox is clicked
function updateHandler(e) {
  // Grab the parent li of the checkbox that triggered the event
  var html = $(this).parent().parent();
  var flashUpdate = function(){
    html.addClass('animated flash');
    setTimeout(flashUpdate(), 2000);
    };


  // Get the id of the search we are updating and use it to fetch the data through the button

  var id = $(this).parent().parent().attr('id')
  var firstTd = $('#'+id).children().first()
  var is_edit = firstTd.next().next().children().first().html()
  if (is_edit == 'Edit'){
    var firstValue = firstTd.html()
    var secondValue = firstTd.next().html()
    firstTd.html('<input value="'+firstValue+'">')
    firstTd.next().html('<input value="'+secondValue+'">')
    firstTd.next().next().html('<button type="button" class="editBtn btn btn-danger">Submit</button>  <button type="button" class="delBtn btn btn-warning">Delete</button>')
    $('.editBtn')
  }
  else{
  // User AJAX to update the search in our db
  var starting_point = firstTd.children().first().val()
  var destination = firstTd.next().children().first().val()

  $.ajax({
      type: "PATCH",
      url: "/api/search/" + encodeURIComponent(id),
      data: {
        starting_point: starting_point,
        destination: destination
      }
    }).then(
      function(data) {

        firstTd.html(data.starting_point);
        firstTd.next().html(data.destination);
        firstTd.next().next().html('<button type="button" class="editBtn btn btn-info">Edit</button>  <button type="button" class="delBtn btn btn-warning">Delete</button>');


      }
    )
  }
}



// Define function that will get executed when the X is clicked on.
function deleteHandler(e) {

  //Grab the parent tr of the table
  var html = $(this).parent().parent();
  var flashDelete = function(){
    html.addClass('animated flash');
    setTimeout(flashDelete(), 2000);
    };


  // Get the id of the search we are deleting
  var id = $(this).parent().parent().attr('id');

  // Use AJAX to delete the search from our db
  $.ajax({
    type: "DELETE",
    url: "/api/search/" + encodeURIComponent(id)
  }).then(
    // Use jquery to remove it from the DOM
    function() {
      console.log('awww yeah')
      html.remove();
    }
  );
}

$(document).ready(function(){
  $start = $('#start');
  getSearches();
  // console.log(search)
  $.ajax({
    url: '/api/search',
    method: 'get', // GET by default
    dataType: 'json' // Intelligent Guess by default (xml, json, script, or html)
  }).done(function(data){
    console.log(data);
  });

$start.on("click", ".editBtn", updateHandler);
$start.on("click", ".delBtn", deleteHandler);
});
