<script>

/* -----------------------------
SIMPLE LOCAL DATABASE
--------------------------------*/

let animals = JSON.parse(localStorage.getItem("animals")) || []
let loggedIn = localStorage.getItem("loggedIn") || false


/* -----------------------------
AUTH BUTTONS
--------------------------------*/

const loginBtn = document.getElementById("loginBtn")
const logoutBtn = document.getElementById("logoutBtn")

loginBtn.onclick = () => {

loggedIn = true
localStorage.setItem("loggedIn", true)

alert("Logged in successfully")

}

logoutBtn.onclick = () => {

loggedIn = false
localStorage.removeItem("loggedIn")

alert("Logged out")

}


/* -----------------------------
IMAGE PREVIEW
--------------------------------*/

document.getElementById("imageUpload").addEventListener("change", e => {

const file = e.target.files[0]
const reader = new FileReader()

reader.onload = event => {

document.getElementById("preview").src = event.target.result

}

reader.readAsDataURL(file)

})


/* -----------------------------
POST ANIMAL
--------------------------------*/

document.getElementById("postBtn").onclick = () => {

if(!loggedIn){

alert("Login first to post livestock")
return

}

let name = document.getElementById("name").value
let breed = document.getElementById("breed").value
let age = document.getElementById("age").value
let weight = document.getElementById("weight").value
let price = document.getElementById("price").value
let description = document.getElementById("description").value
let image = document.getElementById("preview").src

if(!name || !price){

alert("Please fill required fields")
return

}

let animal = {

id: Date.now(),
name,
breed,
age,
weight,
price,
description,
image

}

animals.push(animal)

localStorage.setItem("animals", JSON.stringify(animals))

renderAnimals()

alert("Animal posted successfully")

}


/* -----------------------------
RENDER MARKET TABLE
--------------------------------*/

function renderAnimals(){

const table = document.querySelector("tbody")

table.innerHTML = ""

animals.forEach(animal => {

let row = document.createElement("tr")

row.innerHTML = `

<td>${animal.name}</td>
<td>${animal.breed}</td>
<td>${animal.age}</td>
<td>${animal.weight}</td>
<td>KES ${animal.price}</td>

<td>
<button onclick="viewAnimal(${animal.id})">View</button>
<button onclick="deleteAnimal(${animal.id})">Delete</button>
</td>

`

table.appendChild(row)

})

updateStats()

}


/* -----------------------------
VIEW ANIMAL
--------------------------------*/

function viewAnimal(id){

let animal = animals.find(a => a.id === id)

alert(

`Animal: ${animal.name}

Breed: ${animal.breed}

Age: ${animal.age}

Weight: ${animal.weight}

Price: KES ${animal.price}

Description: ${animal.description}`

)

}


/* -----------------------------
DELETE ANIMAL
--------------------------------*/

function deleteAnimal(id){

animals = animals.filter(a => a.id !== id)

localStorage.setItem("animals", JSON.stringify(animals))

renderAnimals()

}


/* -----------------------------
SEARCH LIVESTOCK
--------------------------------*/

document.querySelector(".search").addEventListener("input", e => {

let keyword = e.target.value.toLowerCase()

let rows = document.querySelectorAll("tbody tr")

rows.forEach(row => {

let text = row.innerText.toLowerCase()

row.style.display = text.includes(keyword) ? "" : "none"

})

})


/* -----------------------------
DASHBOARD STATS
--------------------------------*/

function updateStats(){

document.querySelector(".cards").children[0].querySelector("p").innerText = animals.length

document.querySelector(".cards").children[1].querySelector("p").innerText = animals.length

let revenue = animals.reduce((sum,a)=> sum + Number(a.price || 0),0)

document.querySelector(".cards").children[2].querySelector("p").innerText = "KES " + revenue

document.querySelector(".cards").children[3].querySelector("p").innerText = animals.length

}


/* -----------------------------
INITIAL LOAD
--------------------------------*/

renderAnimals()

</script>
