// chrome.browserAction.onClicked.addListener(function() {
//   chrome.tabs.create({'url':"chrome://newtab"})
// })

//** Variables **********
var createFormShowing = false;
var createFormChecked = false;
var viewBottleFormShowing = false;
var editBottleFormChecked = false;
var editBottleFormShowing = false;
var editSubjectsFormShowing = false;
var editSubjectFormShowing = false;
var editSubjectFormChecked = false;
var addSubjectFormShowing = false;
var addSubjectFormChecked = false;
var confirmationPopUpShowing = false;
var formChecked = false;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var bottles = [];
var currentBottle = null;
var currentSubjectName = "";
var currentSubject = null;
var subjectsList = [];
var selectedColor = "colorGray0";
var firstSubjectEmpty = true;

var plantsBottomImg;
var plantsBottom;

//** Preload *************

function preload() {
  // plantsBottomImg = loadImage("images/plantsBottom.png");
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
    if (subjectsList.length > 0) { // subjects exist
      createFormSubjectSelector.toggleClass('active');
      createFormSubjectList.slideToggle(200);
    }
    else { // no subjects exist
      addSubjectForm(); // brings users directly to add subject form
    }
  });

  createFormSubjectList.mouseup(function(e) {
    var selectedSubjectName = $(e.target).text();
    createFormSubjectSelector.html(selectedSubjectName); // replaces subject slot with selected subject
    for (i = 0; i < subjectsList.length; i++) { // header color changes to selected subject color
      if (subjectsList[i][0] == selectedSubjectName) {
        changeHeaderColor("createForm", subjectsList[i][1].substring(5) + "0");
        createFormSubjectSelector.click();
        return;
      }
    }

  });  
  
  // Subject Dropdown
  var editBottleFormSubjectSelector = $('#bottleSubject');
  var editBottleFormSubjectList = $('.bottleSubjectsList');

  editBottleFormSubjectSelector.click(function() {
    if (subjectsList.length > 0) { // subjects exist
      editBottleFormSubjectSelector.toggleClass('active');
      editBottleFormSubjectList.slideToggle(200);
    }
    else { // no subjects exist
      addSubjectForm(); // brings users directly to add subject form
    }
  });

  editBottleFormSubjectList.mouseup(function(e) {
    var selectedSubjectName = $(e.target).text();
    editBottleFormSubjectSelector.html(selectedSubjectName); // replaces subject slot with selected subject
    for (i = 0; i < subjectsList.length; i++) { // header color changes to selected subject color
      if (subjectsList[i][0] == selectedSubjectName) {
        changeHeaderColor("editBottleForm", subjectsList[i][1].substring(5) + "0");
        editBottleFormSubjectSelector.click();
        return;
      }
    }
  });

  // Environment
  // plantsBottom = createSprite(700, 150, 100, 100);
  // plantsBottom.addImage(plantsBottomImg);
}

//** Draw ****************

function draw() {

  setTime();
  quoteByHover();

  // Form Checker
  if (createFormShowing) { // create form
    if (firstSubjectEmpty) { // if no subjects exist
      if (subjectsList.length > 0) {
        setInitialFormSubject("createForm"); // automatically fills in newly added subject name
        firstSubjectEmpty = false;
      }
    }
    formCheck("createForm");
    if (formChecked) {
      createFormChecked = true;
    }
    else {
      createFormChecked = false;
    }
  }
  else if (editBottleFormShowing) { // edit bottle form
    formCheck("editBottleForm");
    if (formChecked) {
      editBottleFormChecked = true;
    }
    else {
      editBottleFormChecked = false;
    }
  }
  if (editSubjectFormShowing) { // edit subject form
    formCheck("editSubjectForm");
    if (formChecked) {
      editSubjectFormChecked = true;
    }
    else {
      editSubjectFormChecked = false;
    }
  }
  else if (addSubjectFormShowing) { // add subject form
    formCheck("addSubjectForm");
    if (formChecked) {
      addSubjectFormChecked = true;
    }
    else {
      addSubjectFormChecked = false;
    }
  }

  drawSprites();

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

  document.getElementById("quote").textContent = quote;
  document.getElementById("quoteBy").textContent = quoteBy;
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
    // Bottle image progress update
    for (i = 0; i < bottles.length; i++) { 
      if (bottles[i] == currentBottle) {
        if (currentBottle.progress == 100) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + currentBottle.color + "100.gif");
        }
        else if (currentBottle.progress >= 75) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + currentBottle.color + "75.gif");
        }
        else if (currentBottle.progress >= 50) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + currentBottle.color + "50.gif");
        }
        else if (currentBottle.progress > 0) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + currentBottle.color + "25.gif");
        }
        else {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle.gif");
        }
      }
    }
  }
}

function setSlider(value) { // Not changing any data, already have data, just changing visuals
  const thumb = document.querySelector("#thumb");
  const track = document.querySelector("#track-inner");
  thumb.style.left = `${value}%`;
  track.style.width = `${value}%`;
  document.getElementById("viewBottleFormPercent").textContent = value + "% complete";
  document.getElementById("track-inner").style.background = "var(--subject" + currentBottle.color + ")";
  document.getElementById("thumb").style.background = "var(--subject" + currentBottle.color + ")";
}

class Bottle {

  constructor(subject, dueDate, title, details, color) {
    this.subject = subject;
    this.dueDate = dueDate;
    this.title = title;
    this.details = details;
    this.progress = 0;
    this.color = color;
  }

}

function createBottle() { // Creates new bottle div and bottle object

  if (createFormChecked) {
    var subject = document.getElementById("formSubject").textContent;
    var dueDate = document.getElementById("formDueDate").value;
    var title = document.getElementById("formTitle").value;
    var details = document.getElementById("formDetails").value;
    for (i = 0; i < subjectsList.length; i++) {  // getting subject color
      if (subjectsList[i][0] == subject) {
        var color = subjectsList[i][1].substring(5);
      }
    }
    var bottlesArea = document.getElementById("bottlesArea");

    if (bottles.length < 10) { // bottle limit
      var newBottle = new Bottle(subject, dueDate, title, details, color);
      bottles.push(newBottle);

      var bottle = document.createElement("div");
      bottle.setAttribute("class", "bottle");
      bottle.addEventListener("click", bottlePressed, false);
      bottle.addEventListener("mouseover", bottleHoveredTrue, false);
      bottle.addEventListener("mouseleave", bottleHoveredFalse, false);

      var bottleImg = document.createElement("img");
      bottleImg.setAttribute("src", "images/bottles/bottle.gif");
      bottle.append(bottleImg);

      bottlesArea.append(bottle);

      createForm();
    }
  }

}

function formCheck(formName) {

  var formType;

  if (formName == "editSubjectForm" || formName == "addSubjectForm") {
    if (formName == "editSubjectForm") { // Edit subject form
      var name = document.getElementById("editSubjectName");
  
    }
    else if (formName == "addSubjectForm") { // Add new subject form
      var name = document.getElementById("subjectName");
    }

    var form = document.getElementById(formName);
    if (name.value == "") {
      name.style.outline = "2px rgb(202, 0, 0) solid"; // red
      form.getElementsByTagName('p')[0].style.display = "flex"; // "required" text
      document.getElementById(formName.substring(0, formName.length - 4) + "Colors").style.marginTop = "20px";
      formChecked = false;
    }
    else {
      name.style.outline = "2px transparent solid"; 
      form.getElementsByTagName('p')[0].style.display = "none";
      document.getElementById(formName.substring(0, formName.length - 4) + "Colors").style.marginTop = "30px";
      formChecked = true;
    }
    return;
  }

  if (formName == "createForm") { // Create bottle form
    formType = "form";
  }

  else if (formName == "editBottleForm") { // Edit bottle form
    formType = "bottle";
  }

  var subject = document.getElementById((formType + "Subject"));
  var title = document.getElementById((formType + "Title"));
  var details = document.getElementById((formType + "Details"));
  var form = document.getElementById(formName);
  var addButton = document.getElementById(formName + "EditSubjectsButton");

  if (subject.textContent == "---- N/A ----") { // Subject not filled in
    subject.style.border = "2px rgb(202, 0, 0) solid"; // red
    subject.style.color = "rgb(22, 23, 24)";
    addButton.style.width = "23px";
    addButton.style.height = "20px";
    addButton.style.top = "24px";
    addButton.style.borderRadius = "0px 3px 3px 0px";
    form.getElementsByTagName('p')[0].style.display = "flex"; // "required" text
    formChecked = false;
    details.rows = "7";
  }
  else { // Subject filled in
    subject.style.color = "white";
    subject.style.border = "2px transparent solid"; 
    addButton.style.width = "25px";
    addButton.style.height = "24px";
    addButton.style.top = "22px";
    addButton.style.borderRadius = "0px 4px 4px 0px";
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
  document.getElementById("formSubject").textContent = "---- N/A ----";

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

  if (viewBottleFormShowing) { // only one form showing at a time
    viewBottleFormClose();
  }
  if (editBottleFormShowing) {
    editBottleFormClose();
  }

  currentBottle = null;
  clearForm();
  createFormChecked = false;
  formChecked = false;
  changeHeaderColor("createForm", "Gray0"); // default gray header

  var createForm = document.getElementById("createForm"); // show create form

  if (!createFormShowing) {
    createForm.style.display = "flex";
    createForm.style.opacity = 1;
    createFormShowing = true;
  }
  else { // hide create form
    createForm.style.opacity = 0;
    setTimeout(() => {
      createForm.style.display = "none";
    }, 300);
    createFormShowing = false;
  }

}

function editBottleForm() { // Edit Bottle Form

  // Hides View Bottle
  var viewBottleForm = document.getElementById("viewBottleForm");
  viewBottleForm.style.opacity = 0;
  setTimeout(() => {
    viewBottleForm.style.display = "none";
  }, 300);
  viewBottleFormShowing = false;

  // Set visible
  var editBottleForm = document.getElementById("editBottleForm");
  editBottleForm.style.display = "flex";
  editBottleForm.style.opacity = 1;
  editBottleFormShowing = true;

  // Fills in current bottle information
  var title = currentBottle.title;
  var subject = currentBottle.subject;
  var details = currentBottle.details;
  var duedate = currentBottle.dueDate;
  document.getElementById("bottleTitle").value = title;
  document.getElementById("bottleSubject").textContent = subject;
  document.getElementById("bottleDetails").value = details;
  document.getElementById("bottleDueDate").value = duedate;
  changeHeaderColor("editBottleForm", currentBottle.color + "0");

}

function editBottleFormSave() {

  if (editBottleFormChecked) {

    currentBottle.title = document.getElementById("bottleTitle").value;
    currentBottle.subject = document.getElementById("bottleSubject").textContent;
    currentBottle.details = document.getElementById("bottleDetails").value;
    currentBottle.dueDate = document.getElementById("bottleDueDate").value;
    currentBottle.color = document.getElementById("editBottleFormHeader").style.backgroundColor.substring(13).slice(0, -1);

    editBottleFormClose(); // Close edit bottle form
    updateBottle(); // Updates changes to view bottle form
    viewBottleForm(); // Reopens view bottle form

  }
  
}

function editBottleFormClose() {
  var editBottleForm = document.getElementById("editBottleForm");
  editBottleForm.style.opacity = 0;
  setTimeout(() => {
    editBottleForm.style.display = "none";
  }, 300);
  editBottleFormShowing = false;
}

function viewBottleForm() { // View Bottle Form
  var viewBottleForm = document.getElementById("viewBottleForm");
  viewBottleForm.style.display = "block";
  viewBottleForm.style.opacity = 1;
  viewBottleFormShowing = true; 
}

function viewBottleFormDelete() {
  var bottlesArea = document.getElementById("bottlesArea");
  for (i=0; i<bottles.length; i++) {
    if (bottles[i] == currentBottle) {
      bottles.splice(i, 1);
      bottlesArea.removeChild(bottlesArea.children[i]);
      viewBottleFormClose();
    }
  }
}

function viewBottleFormClose() {
  var viewBottleForm = document.getElementById("viewBottleForm");
  viewBottleForm.style.opacity = 0;
  setTimeout(() => {
    viewBottleForm.style.display = "none";
  }, 300);
  viewBottleFormShowing = false;
  currentBottle = null;
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
    viewBottleFormClose();
    return;
  }

  if (createFormShowing) { // Close other forms if they are showing
    createForm();
  }

  viewBottleForm(); // Opens up view bottle form
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
  var quickViewDueDate = document.getElementById("quickViewDueDate");

  quickView.style.display = "block";
  quickView.style.opacity = 1;
  if (e.pageX < width/2) {
    quickView.style.left = e.pageX + 50 + "px";
  }
  else {
    quickView.style.left = e.pageX - 350 + "px";
  }
  quickView.style.top = e.pageY + 50 + "px";

  quickViewTitle.textContent = bottles[i].title;
  quickViewSubject.textContent = bottles[i].subject;
  var duedate = new Date(bottles[i].dueDate + "EST0:00:01");
  quickViewDueDate.textContent = monthNames[duedate.getMonth()] + " " + duedate.getDate();
  quickView.style.boxShadow = "0 0 0 0.4em var(--subject" + bottles[i].color + ")";
}

function bottleHoveredFalse(e) {

  var quickView = document.getElementById("quickView");
  quickView.style.opacity = 0;
  quickView.style.display = "none";
}

function updateBottle() {

  // Copy bottle info to view bottle form
  document.getElementById("viewBottleFormTitle").innerText = currentBottle.title;
  document.getElementById("viewBottleFormSubject").textContent = currentBottle.subject;
  document.getElementById("viewBottleFormDetails").innerText = currentBottle.details;
  changeHeaderColor("viewBottleForm", currentBottle.color + "0"); // Header color
  document.getElementById("viewBottleFormCloseBottleButton").addEventListener("mouseover", function () {
    this.style.fill = "var(--subject" + currentBottle.color + ")"; // close button color on hover
  }) 
  document.getElementById("viewBottleFormCloseBottleButton").addEventListener("mouseout", function () {
    this.style.fill = "white"; // close button color
  }) 
  setSlider(currentBottle.progress);
  
  var duedate = new Date(currentBottle.dueDate + "EST0:00:01");
  document.getElementById("viewBottleFormDueTime").innerText = "Due " + weekdayNames[duedate.getDay()] + ", " + monthNames[duedate.getMonth()] + " " + duedate.getDate();
    
  // Size of view bottle form changes depending on title/details length
  if (currentBottle.details.length > 0) { // Has details
    if (viewBottleFormTitle.innerText.length > 19) { // Long title
      document.getElementById("viewBottleFormHeader").style.height = "80px";
    }
    else { // Short title
      document.getElementById("viewBottleFormHeader").style.height = "54px";
    }
    document.getElementById("viewBottleForm").style.height = "480px";
  }
  else { // No details
    if (viewBottleFormTitle.innerText.length > 33) { // Long title
      document.getElementById("viewBottleFormHeader").style.height = "80px";
      document.getElementById("viewBottleForm").style.height = "260px";
    }
    else {
      document.getElementById("viewBottleFormHeader").style.height = "54px";
      document.getElementById("viewBottleForm").style.height = "230px";
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
      document.getElementById("viewBottleFormCountdown").innerText = "Due today";
    }
    else if (days == 0 && duedate.getDay() - 1 == now.getDay()) {
      document.getElementById("viewBottleFormCountdown").innerText = "Due tomorrow";
    }
    else if (days > 0) {
      document.getElementById("viewBottleFormCountdown").innerText = days + 1 + " days to complete";
    }
    else if (timeRemaining < 0 && duedate.getDay() + 1 == now.getDay()) {
      document.getElementById("viewBottleFormCountdown").innerText = "Overdue by 1 day";
      document.getElementById("viewBottleFormCountdown").style.color = "#CA0000";
    }
    else {
      document.getElementById("viewBottleFormCountdown").innerText = "Overdue by " + -(days + 1) + " days";
      document.getElementById("viewBottleFormCountdown").style.color = "#CA0000";
    }

}

function editSubjectsForm() {
  var editSubjectsForm = document.getElementById("editSubjectsFormOverlay");
  if (!editSubjectsFormShowing) { // opening form
    editSubjectsForm.style.display = "flex";
    editSubjectsForm.style.opacity = 1;
    editSubjectsFormShowing = true;
  }
  else { // closing form
    editSubjectsForm.style.opacity = 0; 
    setTimeout(() => {
      editSubjectsForm.style.display = "none";
    }, 300);
    editSubjectsFormShowing = false;
  }
}

function editSubjectForm() { // handles showing and hiding edit subject form
  var editSubjectForm = document.getElementById("editSubjectFormOverlay");
  if (!editSubjectFormShowing) { // opening form
    editSubjectForm.style.display = "flex";
    editSubjectForm.style.opacity = 1;
    editSubjectFormShowing = true;

    for (i = 0; i < subjectsList.length; i++) { // find subject in js subjects list
      if (currentSubject != null) {
        if (subjectsList[i][0] == currentSubject.textContent) {
          editSubjectName.value = subjectsList[i][0];
          selectedColor = subjectsList[i][1] + "2";
          subjectSelectedColor("editSubjectForm");
        }
      }
    }
  }
  else { // closing form
    // Hide form
    editSubjectForm.style.opacity = 0; 
    setTimeout(() => {
      editSubjectForm.style.display = "none";
    }, 300);
    editSubjectFormShowing = false;
  }
}

function editSubjectFormDelete() {
  var index = Array.prototype.indexOf.call(currentSubject.parentNode.children, currentSubject); // gets index of subject in parent div (js subjects list)
  subjectsList.splice(index, 1); // removes selected subject from js subjects list
 
  // Remove subject name in html create form and edit bottle form subjects list
  document.querySelectorAll(".subjectsList").forEach(subjectList => {
    subjectList.removeChild(subjectList.childNodes[index]);
  });

  var list = document.getElementById("editSubjectsFormSubjectsList");
  list.removeChild(list.childNodes[index]); // removes subject name on edit subjects form

  document.getElementById("formSubject").textContent = "---- N/A ----"; // resets create bottle subject selector
  document.getElementById("bottleSubject").textContent = "---- N/A ----"; // resets create bottle subject selector
  editSubjectForm(); // close edit subject form

}

function editSubjectSave() {

  var name = document.getElementById("editSubjectName").value;
  var color = document.getElementById("editSubjectFormHeader").style.backgroundColor;

  if (editSubjectFormChecked) {
    if (name == currentSubjectName) { // name unchanged, only a color change
      for (i = 0; i < subjectsList.length; i++) { 
        if (subjectsList[i][0] == name) { // finds subject in js subjects list by same name
          subjectsList[i][1] = "color" + color.substring(13).slice(0, -1); // change subject in js subjects list color
          currentSubject.firstChild.style.backgroundColor = color; // change dot color in subjects list
        }
      }
    }

    else { // name changed
      for (i = 0; i < subjectsList.length; i++) { 
        // Checks if new subject name already exists in subjects list
        if (subjectsList[i][0] == name) { // if new subject name already exists, show error message
          document.getElementById("editSubjectName").value = "";
          document.getElementById("editSubjectNameErrorMessage").style.display = "flex"; 
          document.getElementById("editSubjectNameErrorMessage").style.opacity = 1; 
          document.getElementById("editSubjectNameErrorMessage").textContent = "\"" + name + "\"" + " already exists";
          return;
        }
        else {
          document.getElementById("editSubjectNameErrorMessage").textContent = "Required"; // restores default error message
        }
      }
      // No new subject name conflict
      var index = Array.prototype.indexOf.call(currentSubject.parentNode.children, currentSubject); // gets index of subject in parent div (js subjects list)
      // Carry name change to all affected existing bottles
      for (i = 0; i < bottles.length; i++) {
        if (bottles[i].subject == subjectsList[index][0]) {
          bottles[i].subject = name;
        }   
      }
      subjectsList[index][0] = name; // updates subject name in js subjects list
      currentSubject.lastChild.textContent = name; // updates subject name on edit subjects form
      currentSubjectName = name; // updates current subject's name
      // Subjects list color change
      for (i = 0; i < subjectsList.length; i++) { 
        if (subjectsList[i][0] == name) { // finds subject in js subjects list by same name
          subjectsList[i][1] = "color" + color.substring(13).slice(0, -1); // change subject in js subjects list color
          currentSubject.firstChild.style.backgroundColor = color; // change dot color in subjects list
        }
      }
      // Update subject name in html create form and edit bottle form subjects list
      document.querySelectorAll(".subjectsList").forEach(subjectList => {
        subjectList.children.item(index).textContent = name;
      });
      document.getElementById("formSubject").textContent = "---- N/A ----"; // resets create bottle subject selector
      document.getElementById("bottleSubject").textContent = "---- N/A ----"; // resets create bottle subject selector
    }
    
    // Carry color change to all affected existing bottles and updates visuals
    for (i = 0; i < bottles.length; i++) {
      if (bottles[i].subject == currentSubjectName) {

        bottles[i].color = color.substring(13).slice(0, -1);

        if (bottles[i].progress == 100) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + bottles[i].color + "100.gif");
        }
        else if (bottles[i].progress >= 75) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + bottles[i].color + "75.gif");
        }
        else if (bottles[i].progress >= 50) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + bottles[i].color + "50.gif");
        }
        else if (bottles[i].progress > 0) {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle" + bottles[i].color + "25.gif");
        }
        else {
          document.getElementById("bottlesArea").children.item(i).lastChild.setAttribute("src", "images/bottles/bottle.gif");
        }
      }
    }
    editSubjectForm(); // close edit subject form
    updateBottle(); // carry changes to view bottle form

    // Carry changes to open edit bottle form
    if (editBottleFormShowing) {
      document.getElementById("editBottleFormHeader").style.backgroundColor = color;
      document.getElementById("bottleSubject").textContent = name;
    }
  }
}

function addSubjectForm() { // handles showing and hiding add subject form
  // Resets form checks in case new subject is created
  createFormChecked = false;
  editBottleFormChecked = false;
  formChecked = false;

  var addSubjectForm = document.getElementById("addSubjectFormOverlay");
  if (!addSubjectFormShowing) { // opening form
    addSubjectForm.style.display = "flex";
    addSubjectForm.style.opacity = 1;
    addSubjectFormShowing = true;
    selectedColor = "colorGray1";
    subjectSelectedColor("addSubjectForm");
  }
  else { // closing form
    // Resets add subject name and color
    document.getElementById("subjectName").value = "";
    selectedColor = "colorGray1";
    subjectSelectedColor("addSubjectForm");
    // Hide form
    addSubjectForm.style.opacity = 0; 
    setTimeout(() => {
      addSubjectForm.style.display = "none";
    }, 300);
    addSubjectFormShowing = false;
  }
}

function editSubjectSelectColor(event) {
  selectedColor = this.id;
  subjectSelectedColor("editSubjectForm");
}

function addSubjectSelectColor(event) {
  selectedColor = this.id;
  subjectSelectedColor("addSubjectForm");
}

function subjectSelectedColor(formName) { // subject color palette picker
  if (formName == "editSubjectForm") { // edit subject form
    var colors = document.getElementById("editSubjectColors");
  }
  else if (formName == "addSubjectForm") { // add subject form
    var colors = document.getElementById("addSubjectColors");
  }
  
  for (i = 0; i < colors.children.length; i++) {
    if (colors.children[i].id == selectedColor) {
      var selected = colors.children[i].id.substring(5);
      colors.children[i].style.border = "6px var(--subject" + selected.slice(0, -1) + ") solid";
      changeHeaderColor(formName, selected);
    }
    else {
      colors.children[i].style.border = "6px #ffffff00 solid";
    }
  }

}

function addSubjectCreate() {

  if (addSubjectFormChecked) {

    // Adding subjects to subject selectors on forms
    if (subjectsList.length < 8) { // subjects limit
      var name = document.getElementById("subjectName").value;
      for (i = 0; i < subjectsList.length; i++) { // check if subject with same name already exists
        if (subjectsList[i][0] == name) { // if subject name already exists, show error message
          document.getElementById("subjectName").value = "";
          document.getElementById("subjectNameErrorMessage").style.display = "flex"; 
          document.getElementById("subjectNameErrorMessage").style.opacity = 1; 
          document.getElementById("subjectNameErrorMessage").textContent = "\"" + name + "\"" + " already exists";
          return;
        }
        else {
          document.getElementById("subjectNameErrorMessage").textContent = "Required"; // restores default error message
        }
      }

      document.querySelectorAll(".subjectsList").forEach(subjectList => {
        const newSubject = document.createElement("ul");
        newSubject.appendChild(document.createTextNode(name)); // giving ul element text of subject name
        subjectList.appendChild(newSubject); // add to dropdown list for each subjectsList element
      });

      subjectsList.push([name, selectedColor.slice(0, -1)]); // adding new subject info to js subjects list

      // Adding subjects to edit subjects form
      const newSubject = document.createElement("ul");
      newSubject.appendChild(document.createTextNode(name));
      newSubject.classList.add("editSubjectsFormSubject");
      newSubject.setAttribute("style", "display: flex");
      newSubject.onclick = function (e) {
        currentSubject = e.target;
        currentSubjectName = currentSubject.textContent;
        editSubjectForm();
      };
      document.getElementById("editSubjectsFormSubjectsList").appendChild(newSubject);

      // Color dot
      const colorIcon = document.createElement("div");
      colorIcon.setAttribute("style", "background-color: var(--subject" + subjectsList[subjectsList.length - 1][1].substring(5) + ")");
      colorIcon.classList.add("subjectsColorDot");
      newSubject.prepend(colorIcon);

      addSubjectForm(); // close subject form

    }
  }
}

function changeHeaderColor(formName, color) {
  document.getElementById(formName + "Header").style.backgroundColor = "var(--subject" + color.slice(0, -1) + ")";
}

function setInitialFormSubject(formName) {
  if (formName == "createForm") { // create bottle form
    document.getElementById("formSubject").textContent = subjectsList[0][0]; // automatically sets new subject name in create bottle form
  }
  else {
    document.getElementById("bottleSubject").textContent = subjectsList[0][0]; // automatically sets new subject name in edit bottle form
  }
  changeHeaderColor(formName, subjectsList[0][1].substring(5) + "0"); // automatically sets new subject header color
}

function confirmationPopUp() {
  var confirmationPopUp = document.getElementById("confirmationOverlay");
  if (!confirmationPopUpShowing) { // opening popup
    confirmationPopUp.style.display = "flex";
    confirmationPopUp.style.opacity = 1;
    confirmationPopUpShowing = true;

    const message = document.getElementById("confirmationHeader");
    if (viewBottleFormShowing) { // deleting a bottle
      const name = currentBottle.title;
      message.textContent = "Delete bottle \"" + name + "\"?";
    }
    else if (editSubjectsFormShowing) { // deleting a subject
      const name = currentSubjectName;
      message.textContent = "Delete subject \"" + name + "\"?";
    }
  }
  else { // closing form
    // Hide form
    confirmationPopUp.style.opacity = 0; 
    setTimeout(() => {
      confirmationPopUp.style.display = "none";
    }, 300);
    confirmationPopUpShowing = false;
  }
}

function confirmationDelete() {
  if (viewBottleFormShowing) { // deleting a bottle
    viewBottleFormDelete();
  }
  else if (editSubjectsFormShowing) { // deleting a subject
    editSubjectFormDelete();
  }
  confirmationPopUp(); // closes pop up
}
