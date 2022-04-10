// chrome.browserAction.onClicked.addListener(function() {
//   chrome.tabs.create({'url':"chrome://newtab"})
// })

//** Variables **********
var createFormShowing = false;
var createFormChecked = false;
var viewBottleShowing = false;
var editBottleChecked = false;
var editBottleFormShowing = false;
var addSubjectFormShowing = false;
var addSubjectFormChecked = false;
var formChecked = false;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var bottles = [];
var currentBottle = null;
var subjectsList = [];
var selectedColor = "colorGray";

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
  var createFormSubjectSelector = $('#formSubject');
  var createFormSubjectList = $('.formSubjectsList');

  createFormSubjectSelector.click(function() {
    createFormSubjectSelector.toggleClass('active');
    createFormSubjectList.slideToggle(200);
  });

  createFormSubjectList.mouseup(function(e) {
    var selectedSubject = $(e.target).text();
    createFormSubjectSelector.html(selectedSubject); // replaces subject name
    createFormSubjectSelector.click();
  });  
  
  // Subject Dropdown
  var editBottleSubjectSelector = $('#bottleSubject');
  var editBottleSubjectList = $('.bottleSubjectsList');

  editBottleSubjectSelector.click(function() {
    editBottleSubjectSelector.toggleClass('active');
    editBottleSubjectList.slideToggle(200);
  });

  editBottleSubjectList.mouseup(function(e) {
    var selectedSubject = $(e.target).text();
    editBottleSubjectSelector.html(selectedSubject); // replaces subject name
    editBottleSubjectSelector.click();
  });

  // Create Subject Form
  addSubjectSelectedColor();
  
}

//** Draw ****************

function draw() {

  setTime();
  quoteByHover();

  // Form Checker
  if (createFormShowing) {
    formCheck("createForm");
    if (formChecked) {
      createFormChecked = true;
    }
    else {
      createFormChecked = false;
    }
  }
  else if (editBottleFormShowing) {
    formCheck("editBottle");
    if (formChecked) {
      editBottleChecked = true;
    }
    else {
      editBottleChecked = false;
    }
  }
  if (addSubjectFormShowing) {
    formCheck("addSubjectForm");
    if (formChecked) {
      addSubjectFormChecked = true;
    }
    else {
      addSubjectFormChecked = false;
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
  document.getElementById("viewBottlePercent").innerHTML = value + "% complete";
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

  if (createFormChecked) {
    var subject = document.getElementById("formSubject").innerHTML;
    var dueDate = document.getElementById("formDueDate").value;
    var title = document.getElementById("formTitle").value;
    var details = document.getElementById("formDetails").value;
    var bottlesArea = document.getElementById("bottlesArea");

    if (bottles.length < 10) { // bottle limit
      var newBottle = new Bottle(subject, dueDate, title, details);
      bottles.push(newBottle);

      var bottle = document.createElement("div");
      bottle.setAttribute("class", "bottle");
      bottle.addEventListener("click", bottlePressed, false);
      bottle.addEventListener("mouseover", bottleHoveredTrue, false);
      bottle.addEventListener("mouseleave", bottleHoveredFalse, false);

      var bottleImg = document.createElement("img");
      bottleImg.setAttribute("src", "images/testBottle.PNG");
      bottle.append(bottleImg);

      bottlesArea.append(bottle);

      createForm();
    }
  }

}

function formCheck(formName) {

  var formType;

  if (formName == "addSubjectForm") { // Create subject form
    var name = document.getElementById(("subjectName"));
    var form = document.getElementById(formName);
    if (name.value == "") {
      name.style.outline = "2px rgb(202, 0, 0) solid"; // red
      form.getElementsByTagName('p')[0].style.display = "flex"; // "required" text
      document.getElementById("addSubjectColors").style.marginTop = "20px";
      formChecked = false;
    }
    else {
      name.style.outline = "2px transparent solid"; 
      form.getElementsByTagName('p')[0].style.display = "none";
      document.getElementById("addSubjectColors").style.marginTop = "30px";
      formChecked = true;
    }
    return;
  } 

  else if (formName == "createForm") { // Create bottle form
    formType = "form";
  }

  else { // Edit bottle form
    formType = "bottle";
  }

  var subject = document.getElementById((formType + "Subject"));
  var title = document.getElementById((formType + "Title"));
  var details = document.getElementById((formType + "Details"));
  var form = document.getElementById(formName);
  var addButton = document.getElementById(formName + "AddSubjectButton");

  // Subjects currently separated for testing purposes
  if (subject.innerHTML == "<br>" && title.value == "") {
    details.rows = "7";
  }
  if (subject.innerHTML == "<br>") { // Subject not filled in
    subject.style.border = "2px rgb(202, 0, 0) solid"; // red
    addButton.style.width = "28px";
    addButton.style.height = "28px";
    addButton.style.top = "24px";
    form.getElementsByTagName('p')[0].style.display = "flex"; // "required" text
    formChecked = false;
    details.rows = "7";
  }
  else { // Subject filled in
    subject.style.border = "2px transparent solid"; 
    addButton.style.width = "32px";
    addButton.style.height = "32px";
    addButton.style.top = "22px";
    form.getElementsByTagName('p')[0].style.display = "none";
    formChecked = true;
    details.rows = "8";
  }
  if ((title.value == "" && formChecked) || (title.value == "" && !formChecked)) { // Title not filled in
    title.style.border = "2px rgb(202, 0, 0) solid"; // red
    form.getElementsByTagName('p')[1].style.display = "flex"; // "required" text
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
  document.getElementById("formSubject").innerHTML = "<br>";

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
  document.getElementById("formDueDate").value = year + "-" + month + "-" + day;
  document.getElementById("formTitle").value = "";
  document.getElementById("formDetails").value = "";
}

function createForm() { // checks when to show and hide create form

  if (viewBottleShowing) { // only one form showing at a time
    viewBottleClose();
  }
  if (editBottleFormShowing) {
    editBottleClose();
  }

  clearForm();
  createFormChecked = false;
  formChecked = false;

  var createForm = document.getElementById("createForm");
  if (!createFormShowing) {
    createForm.style.display = "flex";
    createForm.style.opacity = 1;
    createFormShowing = true;
  }
  else { 
    createForm.style.opacity = 0;
    setTimeout(() => {
      createForm.style.display = "none";
    }, 300);
    createFormShowing = false;
  }

}

function editBottle() { // Edit Bottle Form

  viewBottleClose();

  // Set visible
  var editBottle = document.getElementById("editBottle");
  editBottle.style.display = "flex";
  editBottle.style.opacity = 1;
  editBottleFormShowing = true;

  var title = currentBottle.title;
  var subject = currentBottle.subject;
  var details = currentBottle.details;
  var duedate = currentBottle.dueDate;
  document.getElementById("bottleTitle").value = title;
  document.getElementById("bottleSubject").innerText = subject;
  document.getElementById("bottleDetails").value = details;
  document.getElementById("bottleDueDate").value = duedate;

}

function editBottleSave() {

  if (editBottleChecked) {

    var editBottle = document.getElementById("editBottle");

    currentBottle.title = document.getElementById("bottleTitle").value;
    currentBottle.subject = document.getElementById("bottleSubject").innerText;
    currentBottle.details = document.getElementById("bottleDetails").value;
    currentBottle.dueDate = document.getElementById("bottleDueDate").value;
    
    editBottleClose(); // Close edit bottle form
    updateBottle(); // Updates changes to view bottle form
    viewBottle(); // Reopens view bottle form

  }
  
}

function editBottleClose() {
  var editBottle = document.getElementById("editBottle");
  editBottle.style.opacity = 0;
  setTimeout(() => {
    editBottle.style.display = "none";
  }, 300);
  editBottleFormShowing = false;
}

function viewBottle() { // View Bottle Form
  var viewBottle = document.getElementById("viewBottle");
  viewBottle.style.display = "block";
  viewBottle.style.opacity = 1;
  viewBottleShowing = true;
}

function viewBottleDelete() {
  var bottlesArea = document.getElementById("bottlesArea");
  for (i=0; i<bottles.length; i++) {
    if (bottles[i] == currentBottle) {
      bottles.splice(i, 1);
      bottlesArea.removeChild(bottlesArea.children[i]);
      viewBottleClose();
    }
  }
}

function viewBottleEdit() {
  viewBottleClose();
  editBottle(); // Edit Bottle
}

function viewBottleClose() {
  var viewBottle = document.getElementById("viewBottle");
  viewBottle.style.opacity = 0;
  setTimeout(() => {
    viewBottle.style.display = "none";
  }, 300);
  viewBottleShowing = false;
}

function bottlePressed(e) {

  // Figure out which bottle was pressed
  var child = e.currentTarget;
  var parent = child.parentNode;
  var i = Array.prototype.indexOf.call(parent.children, child);

  if (editBottleFormShowing) { // If in edit mode, stay
    return;
  } 

  if (currentBottle == bottles[i]) { // If bottle pressed is the one already showing, close
    viewBottleClose();
    currentBottle = null;
    return;
  }

  if (createFormShowing) { // Close other forms if they are showing
    createForm();
  }

  viewBottle(); // Opens up view bottle form
  currentBottle = bottles[i];
  updateBottle();
}

function bottleHoveredTrue(e) {

  // Figure out which bottle is hovered
  var child = e.currentTarget;
  var parent = child.parentNode;
  var i = Array.prototype.indexOf.call(parent.children, child);

  var quickView = document.getElementById("quickView");
  var quickViewTitle = document.getElementById("quickViewTitle");
  var quickViewSubject = document.getElementById("quickViewSubject");

  quickView.style.display = "block";
  quickView.style.opacity = 1;
  quickView.style.top = e.pageY + 50 + "px";
  quickView.style.left = e.pageX + 50 + "px";

  quickViewTitle.innerHTML = bottles[i].title;
  quickViewSubject.innerHTML = bottles[i].subject;

}

function bottleHoveredFalse(e) {

  var quickView = document.getElementById("quickView");
  quickView.style.opacity = 0;
  quickView.style.display = "none";
}

function updateBottle() {

  // Copy bottle info to view bottle form
  document.getElementById("viewBottleTitle").innerText = currentBottle.title;
  document.getElementById("viewBottleSubject").innerText = currentBottle.subject;
  document.getElementById("viewBottleDetails").innerText = currentBottle.details;
  setSlider(currentBottle.progress);
  
  var duedate = new Date(currentBottle.dueDate + "EST0:00:01");
  document.getElementById("viewBottleDueTime").innerText = "Due " + weekdayNames[duedate.getDay()] + ", " + monthNames[duedate.getMonth()] + " " + duedate.getDate();
    
  // Size of view bottle form changes depending on title/details length
  if (currentBottle.details.length > 0) { // Has details
    if (viewBottleTitle.innerText.length > 19) { // Long title
      document.getElementById("viewBottleHeader").style.height = "80px";
    }
    else { // Short title
      document.getElementById("viewBottleHeader").style.height = "54px";
    }
    document.getElementById("viewBottle").style.height = "480px";
  }
  else { // No details
    if (viewBottleTitle.innerText.length > 33) { // Long title
      document.getElementById("viewBottleHeader").style.height = "80px";
      document.getElementById("viewBottle").style.height = "260px";
    }
    else {
      document.getElementById("viewBottleHeader").style.height = "54px";
      document.getElementById("viewBottle").style.height = "230px";
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
      document.getElementById("viewBottleCountdown").innerText = "Due today";
    }
    else if (days == 0 && duedate.getDay() - 1 == now.getDay()) {
      document.getElementById("viewBottleCountdown").innerText = "Due tomorrow";
    }
    else if (days > 0) {
      document.getElementById("viewBottleCountdown").innerText = days + 1 + " days to complete";
    }
    else if (timeRemaining < 0 && duedate.getDay() + 1 == now.getDay()) {
      document.getElementById("viewBottleCountdown").innerText = "Overdue by 1 day";
      document.getElementById("viewBottleCountdown").style.color = "#CA0000";
    }
    else {
      document.getElementById("viewBottleCountdown").innerText = "Overdue by " + -(days + 1) + " days";
      document.getElementById("viewBottleCountdown").style.color = "#CA0000";
    }

}

function addSubjectForm() {
  createFormChecked = false;
  formChecked = false;

  var addSubjectForm = document.getElementById("addSubjectFormOverlay");
  if (!addSubjectFormShowing) {
    addSubjectForm.style.display = "flex";
    addSubjectForm.style.opacity = 1;
    addSubjectFormShowing = true;
  }
  else { 
    addSubjectForm.style.opacity = 0;
    setTimeout(() => {
      addSubjectForm.style.display = "none";
    }, 300);
    addSubjectFormShowing = false;
  }
}

function addSubjectSelectColor(event) {
  selectedColor = this.id;
  addSubjectSelectedColor();
}

function addSubjectSelectedColor() {
  var colors = document.getElementById("addSubjectColors");
  for (i = 0; i < colors.children.length; i++) {
    if (colors.children[i].id == selectedColor) {
      var selected = colors.children[i].id.substring(5);
      colors.children[i].style.border = "6px var(--subject" + selected + ") solid";
    }
    else {
      colors.children[i].style.border = "6px #ffffff00 solid";
    }
  }
}

function addSubjectCreate() {

  if (addSubjectFormChecked) {
    var name = document.getElementById("subjectName").value;

    if (subjectsList.length < 8) { // subjects limit

      var newSubject = document.createElement("ul");
      newSubject.appendChild(document.createTextNode(name));

      subjectsList.push(name);
      document.querySelector(".subjectsList").appendChild(newSubject); 

      addSubjectForm();

    }
  }
}
