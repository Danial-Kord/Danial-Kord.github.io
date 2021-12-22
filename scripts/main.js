// Animations
AOS.init({
  anchorPlacement: 'top-left',
  duration: 1000
});
// var button = document.getElementsByClassName("myButton1");
// button[0].onclick=function(){send_data()};


function send_data(){

  //   $.ajax({
  //     type: "POST",
  //     url: "http://new.ihweb.ir/server.php",
  //     data: { name: "John" ,
  //             user_commnet : "new",
  //             email : "newnew"}
  //   }).done(function( msg ) {
  //     alert( "Data Saved: " + msg );
  //   });
  //   alert("hi");
  // );
  alert("dsdd");

  $.ajax({
    cache: false,
    dataType: "jsonp",
    async: true,
    crossDomain: true,
    headers: {
        "accept": "application/json",
        "Access-Control-Allow-Origin":"*"
    },
        type: "POST",
        url: "http://new.ihweb.ir/server1.php",
        headers: {
          "Access-Control-Allow-Origin":"http://new.ihweb.ir/"
        },
        data: { name: "John" ,
                user_commnet : "new",
                email : "newnew"},
         success: function(res){
                        alert("hey");    //do what you want here...
                        alert(res.tostring());
                 }
     });
     alert("wtffff");

}
// Add your javascript here
