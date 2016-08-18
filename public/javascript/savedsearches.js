console.log('We in this bitch');


function getSearches(){
  var searches = $.get('/api/search')
    .done(function(data){
      $.each(data, function(index, search){
        $('tbody#start').prepend('<tr id="'+ search._id +'"><a href = "#"><td>' + search.starting_point + '</td></a>' + '<td>' + search.destination + '</td><td><button type="button" class="editBtn btn btn-info">Info</button>  <button type="button" class="delBtn btn btn-warning">Delete</button></td></tr>');
        // console.log(search._id)

        // $('tbody.rowlink').rowlink()
        // addSearch(search)
      })
    })
}

function getId(rowInfo) {
}
//pulls the id from the row/column for update/delete

//update function here


// Define function that will get executed when the X is clicked on.
function deleteHandler(e) {

  //Grab the parent li of the span
  var html = $(this).parent().parent();
  var flashDelete = function(){
    html.addClass('animated flash');
    setTimeout(flashDelete(), 2000);
    };

  // settimeout (1 sec)
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


  //clickable entire row
  // $('tbody#start').on("click", function(){
  //   alert(this);
  // })



//
// $personalSearch.on("click", ":checkbox", updateHandler);
// $savedSearch.on("click", ".editBtn", updateHandler);
// $personalSearch.on("click", ".remove-item", deleteHandler);
$start.on("click", ".delBtn", deleteHandler);
});
