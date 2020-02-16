(() => {
  var userList = [];
  const didMount = () => {
    //alert(window.qqq);
  };
  didMount();
  window.addEventListener("message", receiveMessage, false);
  function receiveMessage(event){
    var iframe = document.getElementsByTagName('iframe')[0];
      if( typeof( event.data[0] ) == "object" ){
        userList = event.data;
      }
      if (userList==event.data){
        iframe.onload = function() {
        window.frames[0].postMessage(userList, "*");
      };
      }else{
        iframe.onload = function() {
        window.frames[0].postMessage(userList, "*");
        window.frames[0].postMessage(event.data, "*");
        };
      }
	}
})();