
var popup = document.getElementById("popup");


var span = document.getElementsByClassName("popup-close")[0];

var participate = document.getElementsByClassName("participate")[0];

var doNotShowBtn = document.getElementsByClassName("doNotShowBtn")[0];

span.onclick = function() {
  popup.style.display = "none";

}


  function setDoNotShowFlag() {
    localStorage.setItem("doNotShowPopup", "true");
  }
  
  function shouldShowPopup() {

    return localStorage.getItem("doNotShowPopup") !== "true";
  }


  function closePopup() {
    popup.style.display = "none";
  }
  

  participate.addEventListener("click", function() {
    setDoNotShowFlag();
    closePopup();
  });
  

  doNotShowBtn.addEventListener("click", function() {
    setDoNotShowFlag();
    closePopup();
  });
  

  if (shouldShowPopup()) {
    popup.style.display = "block";
} else {
    popup.style.display = "none"; 
}


window.onclick = function(event) {
    if (event.target == popup) {
      popup.style.display = "none";
    }
  }