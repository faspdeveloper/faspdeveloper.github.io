if ('serviceWorker' in navigator) {
  // console.log("hi");
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('../sw.js')
      .then(function (registration) {
        console.log('Registration successful, scope is:', registration.scope);
      })
      .catch(function (error) {
        console.log('Service worker registration failed, error:', error);
      });
  })
}
document.addEventListener('DOMContentLoaded', function () {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, { edge: 'right' });
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, { edge: 'left' });
});

var db;

// function dbIntialition() {
if (!('indexedDB' in window)) {
  // console.log('This browser does not support IndexedDB');
} else {
  // console.log('In function');
  var openRequest = indexedDB.open('test_db', 1);
  // console.log("OpenRequset", openRequest);
  openRequest.onupgradeneeded = function (e) {
    // console.log('In Open Request');
    var db = e.target.result;
    // console.log('running onupgradeneeded');
    if (!db.objectStoreNames.contains('user')) {
      var storeOS = db.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
      storeOS.createIndex("emailId", "emailId", { unique: true });
    }
  };
  openRequest.onsuccess = function (e) {
    console.log('inside open request');
    db = e.target.result;
    console.log("Db in success", db);
  };
  openRequest.onerror = function (e) {

    console.log('onerror!');
    // console.dir(e);
  };
  // console.log("After open request")
}

// }
function addRecipe() {
  // var db = dbIntialition();
  addItem();
}

function addItem() {
  // var db = dbIntialition();
  var transaction = db.transaction(['user'], 'readwrite');
  var recipe = transaction.objectStore('user');
  var item = {
    name: document.getElementById("name").value,
    emailId: document.getElementById("emailId").value,
    task: "",
    created: new Date().getTime()
  };
  console.log(item);
  var request = recipe.add(item);

  request.onerror = function (e) {
    console.log("In error");
    alert("Duplicate email Id");
    // console.log('Error', e.target.error.name);
  };
  request.onsuccess = function (e) {
    getListOfRecipe();
    document.getElementById("name").value = "";
    document.getElementById("emailId").value = "";
    // document.getElementById("task").value = "";
    // location.reload();
    // console.log('Woot! Did it');
  };
}
var db1;
function getListOfRecipe() {

  var openRequest = indexedDB.open('test_db', 1);
  // console.log("OpenRequset", openRequest);
  openRequest.onupgradeneeded = function (e) {
    // console.log('In Open Request');
    var db1 = e.target.result;
    // console.log('running onupgradeneeded');
    if (!db1.objectStoreNames.contains('user')) {
      var storeOS = db1.createObjectStore('user', { keyPath: 'id', autoIncrement: true });
      storeOS.createIndex("emailId", "emailId", { unique: true });
    }
  };
  openRequest.onsuccess = function (e) {
    console.log('inside open request list of receipe');
    db1 = e.target.result;
    console.log("Db in success in list of receipe", db1);
    var transaction = db1.transaction(['user'], 'readwrite');
    var recipe = transaction.objectStore('user');
    // console.log("keyPath",recipe.keyPath);
    var getRequest = recipe.getAll();
    // console.log(getRequest.result);

    getRequest.onerror = function (event) {
      // Handle errors!
    };
    getRequest.onsuccess = function (event) {
      // Do something with the request.result!
      // console.log("Result", getRequest);
      // console.log(event.target.result.key)
      var myResult = [];
      myResult = getRequest.result;
      console.log(myResult)
      document.getElementById("recipeList").innerHTML = "";
      for (i = 0; i < myResult.length; i++) {
        console.log(myResult[i].name)
        document.getElementById("recipeList").innerHTML += "<div class='card-panel recipe white row' id='divElement'><img src='/img/user.jpeg' alt='recipe thumb'><div class='recipe-details'><div class='recipe-title'>" + myResult[i].name + "</div><div class='recipe-ingredients'>" + myResult[i].emailId + "</div><div class='recipe-ingredients'>" + myResult[i].task + "</div></div><div class='recipe-delete'><a href='#' onclick='listTasks(" + myResult[i].id + ")'><i class='material-icons'>add_outline</i></a><a href='#' onclick='updateOnClickFunction(" + myResult[i].id + ")'><i class='material-icons'>edit_outline</i></a></div></div>";
        // console.log("Get Result" + getRequest.result[i].title);
      }
    };
  };
  openRequest.onerror = function (e) {

    console.log('onerror in list of receipe!');
    // console.dir(e);
  };

}

function updateOnClickFunction(keyVal) {
  // document.getElementById("side-form").style.display = 'block';
  var transaction = db.transaction(['user'], 'readwrite');
  var recipe = transaction.objectStore('user');
  var getRequest = recipe.get(keyVal);
  getRequest.onerror = function (event) {
    // Handle errors!
  };
  getRequest.onsuccess = function (event) {
    document.getElementById("editDiv").style.display = 'block';
    document.getElementById("nameEdit").value = getRequest.result.name;
    document.getElementById("emailIdEdit").value = getRequest.result.emailId;
    document.getElementById("taskEdit").value = getRequest.result.task;
    document.getElementById("userId").value = getRequest.result.id;
    document.getElementById("createdDate").value = getRequest.result.created;
  };

}

function updateRecipe() {
  var transaction = db.transaction(['user'], 'readwrite');
  var recipe = transaction.objectStore('user');
  var item = {
    name: document.getElementById("nameEdit").value,
    emailId: document.getElementById("emailIdEdit").value,
    task: document.getElementById("taskEdit").value,
    created: document.getElementById("createdDate").value,
    id: parseInt(document.getElementById("userId").value)
  };
  item.n
  // console.log("keyPath",recipe.keyPath);
  var getRequest = recipe.put(item);
  // console.log(getRequest.result);

  getRequest.onerror = function (event) {
    // Handle errors!
  };
  getRequest.onsuccess = function (event) {
    document.getElementById("nameEdit").value = '';
    document.getElementById("emailIdEdit").value = '';
    document.getElementById("taskEdit").value = '';
    document.getElementById("userId").value = '';
    document.getElementById("editDiv").style.display = 'none';
    getListOfRecipe();
  };
}

function listTasks(val) {
  window.location = "https://faspdeveloper.github.io/listTask.html?" + val;
}