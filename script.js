let animals = JSON.parse(localStorage.getItem("animals")) || [];

function addAnimal(){

let animal={

name:document.getElementById("name").value,

age:document.getElementById("age").value,

price:document.getElementById("price").value,

location:document.getElementById("location").value,

phone:document.getElementById("phone").value,

image:document.getElementById("image").value

};

animals.push(animal);

localStorage.setItem("animals",JSON.stringify(animals));

displayAnimals();

}


function displayAnimals(){

let market=document.getElementById("market");

market.innerHTML="";

animals.forEach(a=>{

market.innerHTML+=`

<div class="card">

<img src="${a.image}">

<h3>${a.name}</h3>

<p>Age: ${a.age}</p>

<p>Price: KES ${a.price}</p>

<p>Location: ${a.location}</p>

<a href="https://wa.me/${a.phone}">

<button>Contact Seller</button>

</a>

</div>

`;

});

}

displayAnimals();
