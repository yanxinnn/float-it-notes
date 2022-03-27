// chrome.browserAction.onClicked.addListener(function() {
//   chrome.tabs.create({'url':"chrome://newtab"})
// })

//** Variables **********
var cFShowing = false;
var cFChecked = false;
var vBShowing = false;
var eBChecked = false;
var eBShowing = false;
var formChecked = false;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var bottles = [];
var currentBottle = null;


//** Preload *************

function preload() {
}

//** Setup *************

function setup() {

  var canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.parent("interface-div");
  canvas.position(0, 0);
  canvas.style("z-index", "-1");

  setQuote();

  // Progress Bar
  // Reference: https://codepen.io/steveholgado/pen/OEpGXq?editors=1010
  const range = document.querySelector("#range");
  range.oninput = (e) => onSliderMove(e.target.value);

  // Subject Dropdown
  var cFSubjectSelector = $('#fSubject');
  var cFSubjectList = $('.fsubjects');

  cFSubjectSelector.click(function() {
    cFSubjectSelector.toggleClass('active');
    cFSubjectList.slideToggle(200);
  });

  cFSubjectList.mouseup(function(e) {
    var selectedSubject = $(e.target).text();
    cFSubjectSelector.html(selectedSubject); // replaces subject name
    cFSubjectSelector.click();
  });  
  
  // Subject Dropdown
  var eBSubjectSelector = $('#bSubject');
  var eBSubjectList = $('.bsubjects');

  eBSubjectSelector.click(function() {
    eBSubjectSelector.toggleClass('active');
    eBSubjectList.slideToggle(200);
  });

  eBSubjectList.mouseup(function(e) {
    var selectedSubject = $(e.target).text();
    eBSubjectSelector.html(selectedSubject); // replaces subject name
    eBSubjectSelector.click();
  });
  

}

//** Draw ****************

function draw() {

  setTime();
  quoteByHover();

  // Form Checker
  if (cFShowing) {
    formCheck("cF");
    if (formChecked) {
      cFChecked = true;
    }
    else {
      cFChecked = false;
    }
  }
  else if (eBShowing) {
    formCheck("eB");
    if (formChecked) {
      eBChecked = true;
    }
    else {
      eBChecked = false;
    }
  }

}

function setTime() {
  var date = new Date();
  var mins = date.getMinutes();
  if (mins < 10) {
    mins = ("0" + mins);
  }
  var time = ((date.getHours() + 11) % 12 + 1) + ":" + mins;
  document.getElementById("time").innerHTML = time;
  document.getElementById("date").innerHTML = weekdayNames[date.getDay()] + ", " + monthNames[date.getMonth()] + " " + date.getDate();
}

function setQuote() {
  var quote = "\"An inspirational quote that exists for testing purposes. Live laugh love.\"";
  var quoteBy = "Yanxin Jiang";

  document.getElementById("quote").innerHTML = quote;
  document.getElementById("quoteBy").innerHTML = quoteBy;
}

function quoteByHover() {
  var quoteArea = document.getElementById("quoteArea");
  var quoteBy = document.getElementById("quoteBy");
  quoteArea.onmouseover=function() {
    quoteBy.style.opacity = 1.0;
  };
  quoteArea.onmouseout=function() {
    quoteBy.style.opacity = 0.0;
  }
}

function onSliderMove(value) { // Getting user slider input and saving, updating slider visuals
  setSlider(value);
  if (currentBottle) {
    currentBottle.progress = value;
  }
}

function setSlider(value) { // Not changing any data, already have data, just changing visuals
  const thumb = document.querySelector("#thumb");
  const track = document.querySelector("#track-inner");
  thumb.style.left = `${value}%`;
  track.style.width = `${value}%`;
  document.getElementById("vBPercent").innerHTML = value + "% complete";
}

class Bottle {

  constructor(subject, dueDate, title, details) {
    this.subject = subject;
    this.dueDate = dueDate;
    this.title = title;
    this.details = details;
    this.progress = 0;
  }

}

function createBottle() { // Creates new bottle div and bottle object

  if (cFChecked) {
    var subject = document.getElementById("fSubject").innerHTML;
    var dueDate = document.getElementById("fDueDate").value;
    var title = document.getElementById("fTitle").value;
    var details = document.getElementById("fDetails").value;
    var bottlesArea = document.getElementById("bottlesArea");

    if (bottles.length < 10) { // bottle limit
      var newBottle = new Bottle(subject, dueDate, title, details);
      bottles.push(newBottle);

      var bottle = document.createElement("div");
      bottle.setAttribute("class", "bottle");
      bottle.addEventListener("click", bottlePressed, false);
      bottle.addEventListener("mouseover", bottleHoveredT, false);
      bottle.addEventListener("mouseleave", bottleHoveredF, false);

      var bottleImg = document.createElement("img");
      bottleImg.setAttribute("src", "images/testBottle.PNG");
      bottle.append(bottleImg);

      bottlesArea.append(bottle);

      cF();
    }
  }
}

function formCheck(formName) {

  var formType;
  if (formName == "cF") { // differentiating between create/edit forms
    formType = "f";
  }
  else {
    formType = "b";
  }

  var subject = document.getElementById((formType + "Subject"));
  var title = document.getElementById((formType + "Title"));
  var details = document.getElementById((formType + "Details"));
  var form = document.getElementById(formName);

  // Subjects currently separated for testing purposes
  if (subject.innerHTML == "<br>" && title.value == "") {
    details.rows = "7";
  }
  if (subject.innerHTML == "<br>") { // Subject not filled in
    subject.style.border = "2px rgb(202, 0, 0) solid"; // red
    form.getElementsByTagName('p')[0].style.display = "flex"; // "required" text
    formChecked = false;
    details.rows = "7";
  }
  else { // Subject filled in
    subject.style.border = "2px transparent solid"; 
    form.getElementsByTagName('p')[0].style.display = "none";
    formChecked = true;
    details.rows = "8";
  }
  if ((title.value == "" && formChecked) || (title.value == "" && !formChecked)) { // Title not filled in
    title.style.border = "2px rgb(202, 0, 0) solid"; // red
    form.getElementsByTagName('p')[1].style.display = "flex";
    formChecked = false;
  }
  else if (!formChecked) { // Title is filled in but subject isn't
    title.style.border = "2px transparent solid"; 
    form.getElementsByTagName('p')[1].style.display = "none";
    details.rows = "8";
  }
  else {
    title.style.border = "2px transparent solid"; 
    form.getElementsByTagName('p')[1].style.display = "none";
    formChecked = true;
    details.rows = "9";
  }
}

function clearForm() { // resets form values
  document.getElementById("fSubject").innerHTML = "<br>";

  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = ("0" + month);
  }
  var day = date.getDate();
  if (day < 10) {
    day = ("0" + day);
  }
  document.getElementById("fDueDate").value = year + "-" + month + "-" + day;
  document.getElementById("fTitle").value = "";
  document.getElementById("fDetails").value = "";
}

function cF() { // checks when to show and hide create form

  if (vBShowing) { // only one form showing at a time
    vBClose();
  }
  if (eBShowing) {
    eBClose();
  }

  clearForm();
  cFChecked = false;
  formChecked = false;

  var cF = document.getElementById("cF");
  if (!cFShowing) {
    cF.style.display = "flex";
    cF.style.opacity = 1;
    cFShowing = true;
  }
  else { 
    cF.style.opacity = 0;
    setTimeout(() => {
      cF.style.display = "none";
    }, 300);
    cFShowing = false;
  }

}

function eB() { // Edit Bottle Form

  vBClose();

  // Set visible
  var eB = document.getElementById("eB");
  eB.style.display = "flex";
  eB.style.opacity = 1;
  eBShowing = true;

  var title = currentBottle.title;
  var subject = currentBottle.subject;
  var details = currentBottle.details;
  var duedate = currentBottle.dueDate;
  document.getElementById("bTitle").value = title;
  document.getElementById("bSubject").innerText = subject;
  document.getElementById("bDetails").value = details;
  document.getElementById("bDueDate").value = duedate;

}

function eBSave() {

  if (eBChecked) {

    var eB = document.getElementById("eB");

    currentBottle.title = document.getElementById("bTitle").value;
    currentBottle.subject = document.getElementById("bSubject").innerText;
    currentBottle.details = document.getElementById("bDetails").value;
    currentBottle.dueDate = document.getElementById("bDueDate").value;
    
    eBClose(); // Close edit bottle form
    updateBottle(); // Updates changes to view bottle form
    vB(); // Reopens view bottle form

  }
  
}

function eBClose() {
  var eB = document.getElementById("eB");
  eB.style.opacity = 0;
  setTimeout(() => {
    eB.style.display = "none";
  }, 300);
  eBShowing = false;
}

function vB() { // View Bottle Form
  var vB = document.getElementById("vB");
  vB.style.display = "block";
  vB.style.opacity = 1;
  vBShowing = true;
}

function vBDelete() {
  var bottlesArea = document.getElementById("bottlesArea");
  for (i=0; i<bottles.length; i++) {
    if (bottles[i] == currentBottle) {
      bottles.splice(i, 1);
      bottlesArea.removeChild(bottlesArea.children[i]);
      vBClose();
    }
  }
}

function vBEdit() {
  vBClose();
  eB(); // Edit Bottle
}

function vBClose() {
  var vB = document.getElementById("vB");
  vB.style.opacity = 0;
  setTimeout(() => {
    vB.style.display = "none";
  }, 300);
  vBShowing = false;
}

function bottlePressed(e) {

  // Figure out which bottle was pressed
  var child = e.currentTarget;
  var parent = child.parentNode;
  var i = Array.prototype.indexOf.call(parent.children, child);

  if (eBShowing) { // If in edit mode, stay
    return;
  } 

  if (currentBottle == bottles[i]) { // If bottle pressed is the one already showing, close
    vBClose();
    currentBottle = null;
    return;
  }

  if (cFShowing) { // Close other forms if they are showing
    cF();
  }

  vB(); // Opens up view bottle form
  currentBottle = bottles[i];
  updateBottle();
}

function bottleHoveredT(e) {

  // Figure out which bottle is hovered
  var child = e.currentTarget;
  var parent = child.parentNode;
  var i = Array.prototype.indexOf.call(parent.children, child);

  var qV = document.getElementById("qV");
  var qVTitle = document.getElementById("qVTitle");
  var qVSubject = document.getElementById("qVSubject");

  qV.style.display = "block";
  qV.style.opacity = 1;
  qV.style.top = e.pageY + 50 + "px";
  qV.style.left = e.pageX + 50 + "px";

  qVTitle.innerHTML = bottles[i].title;
  qVSubject.innerHTML = bottles[i].subject;

}

function bottleHoveredF(e) {

  var qV = document.getElementById("qV");
  qV.style.opacity = 0;
  qV.style.display = "none";
}

function updateBottle() {

  // Copy bottle info to view bottle form
  document.getElementById("vBTitle").innerText = currentBottle.title;
  document.getElementById("vBSubject").innerText = currentBottle.subject;
  document.getElementById("vBDetails").innerText = currentBottle.details;
  setSlider(currentBottle.progress);
  
  var duedate = new Date(currentBottle.dueDate + "EST0:00:01");
  document.getElementById("vBDueTime").innerText = "Due " + weekdayNames[duedate.getDay()] + ", " + monthNames[duedate.getMonth()] + " " + duedate.getDate();
    
  // Size of view bottle form changes depending on title/details length
  if (currentBottle.details.length > 0) { // Has details
    if (vBTitle.innerText.length > 19) { // Long title
      document.getElementById("vBHeader").style.height = "80px";
    }
    else { // Short title
      document.getElementById("vBHeader").style.height = "54px";
    }
    document.getElementById("vB").style.height = "480px";
  }
  else { // No details
    if (vBTitle.innerText.length > 33) { // Long title
      document.getElementById("vBHeader").style.height = "80px";
      document.getElementById("vB").style.height = "260px";
    }
    else {
      document.getElementById("vBHeader").style.height = "54px";
      document.getElementById("vB").style.height = "230px";
    }
  }

    // Countdown text depending on how far away due date is
    var now = new Date();
    var timeRemaining = duedate - now;
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var days = Math.floor(timeRemaining / _day);
    if (days < 0 && duedate.getDay() == now.getDay() && duedate.getDate() == now.getDate()) {
      document.getElementById("vBCountdown").innerText = "Due today";
    }
    else if (days == 0 && duedate.getDay() - 1 == now.getDay()) {
      document.getElementById("vBCountdown").innerText = "Due tomorrow";
    }
    else if (days > 0) {
      document.getElementById("vBCountdown").innerText = days + 1 + " days to complete";
    }
    else if (timeRemaining < 0 && duedate.getDay() + 1 == now.getDay()) {
      document.getElementById("vBCountdown").innerText = "Overdue by 1 day";
      document.getElementById("vBCountdown").style.color = "#CA0000";
    }
    else {
      document.getElementById("vBCountdown").innerText = "Overdue by " + -(days + 1) + " days";
      document.getElementById("vBCountdown").style.color = "#CA0000";
    }

}
