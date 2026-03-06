// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDC6SdxI_vTZcwDYB_PFDe3IxC5O8eN0sI",
  authDomain: "boma-df6e6.firebaseapp.com",
  databaseURL: "https://boma-df6e6-default-rtdb.firebaseio.com",
  projectId: "boma-df6e6",
  storageBucket: "boma-df6e6.appspot.com",
  messagingSenderId: "880769903150",
  appId: "1:880769903150:web:a260dde02bc13b4a91cdbf",
  measurementId: "G-NF39XTLK4C"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

// DOM Elements
const postBtn = document.getElementById("postBtn");
const searchInput = document.getElementById("search");
const filterAnimal = document.getElementById("filterAnimal");
const filterLocation = document.getElementById("filterLocation");
const previewImg = document.getElementById("preview");
const imageInput = document.getElementById("imageUpload");

// Preview image
imageInput.addEventListener("change", function() {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// Add animal
postBtn.addEventListener("click", function() {
  const file = imageInput.files[0];
  if (!file) { alert("Please select an image"); return; }

  const animal = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    price: document.getElementById("price").value,
    location: document.getElementById("location").value,
    phone: document.getElementById("phone").value
  };

  const storageRef = storage.ref("animals/" + Date.now() + "_" + file.name);
  storageRef.put(file).then(snapshot => {
    snapshot.ref.getDownloadURL().then(url => {
      animal.image = url;
      db.ref("animals").push(animal);
      imageInput.value = "";
      previewImg.src = "";
      document.getElementById("name").value="";
      document.getElementById("age").value="";
      document.getElementById("price").value="";
      document.getElementById("location").value="";
      document.getElementById("phone").value="";
    });
  });
});

// Display animals
function displayAnimals(list) {
  const market = document.getElementById("market");
  market.innerHTML = "";
  list.forEach(a => {
    market.innerHTML += `
      <div class="card">
        <img src="${a.image}">
        <h3>${a.name}</h3>
        <p>Age: ${a.age}</p>
        <p>Price: KES ${a.price}</p>
        <p>Location: ${a.location}</p>
        <a href="https://wa.me/${a.phone}" target="_blank"><button>Contact Seller</button></a>
      </div>
    `;
  });
}

// Listen for database changes
db.ref("animals").on("value", snapshot => {
  const data = snapshot.val();
  const list = [];
  for (let key in data) list.push(data[key]);
  displayAnimals(list);
});

// Filters & Search
function filterAndSearch() {
  const search = searchInput.value.toLowerCase();
  const animalVal = filterAnimal.value;
  const locationVal = filterLocation.value;

  db.ref("animals").once("value", snapshot => {
    const data = snapshot.val();
    const list = [];
    for (let key in data) list.push(data[key]);
    const filtered = list.filter(a =>
      a.name.toLowerCase().includes(search) &&
      (animalVal === "" || a.name === animalVal) &&
      (locationVal === "" || a.location === locationVal)
    );
    displayAnimals(filtered);
  });
}

searchInput.addEventListener("keyup", filterAndSearch);
filterAnimal.addEventListener("change", filterAndSearch);
filterLocation.addEventListener("change", filterAndSearch);
