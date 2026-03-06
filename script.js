let animals = JSON.parse(localStorage.getItem("animals")) || [];

function addAnimal(){

let file=document.getElementById("imageUpload").files[0];

if(!file){
alert("Please upload an image");
return;
}

let reader=new FileReader();

reader.onload=function(){

let animal={

name:document.getElementById("name").value,
age:document.getElementById("age").value,
price:document.getElementById("price").value,
location:document.getElementById("location").value,
phone:document.getElementById("phone").value,
image:reader.result

};

animals.push(animal);

localStorage.setItem("animals",JSON.stringify(animals));

displayAnimals();

};

reader.readAsDataURL(file);

}

function displayAnimals(list=animals){

let market=document.getElementById("market");

market.innerHTML="";

list.forEach(a=>{

market.innerHTML+=`

<div class="card">

<img src="${a.image}">

<h3>${a.name}</h3>

<p>Age: ${a.age}</p>

<p>Price: KES ${a.price}</p>

<p>Location: ${a.location}</p>

<a href="https://wa.me/${a.phone}" target="_blank">

<button>Contact Seller</button>

</a>

</div>

`;

});

}

function searchAnimals(){

let search=document.getElementById("search").value.toLowerCase();

let animalFilter=document.getElementById("filterAnimal").value;

let locationFilter=document.getElementById("filterLocation").value;

let filtered=animals.filter(a=>{

return(

(a.name.toLowerCase().includes(search)) &&
(animalFilter=="" || a.name==animalFilter) &&
(locationFilter=="" || a.location==locationFilter)

);

});

displayAnimals(filtered);

}

displayAnimals();
