// ------------------------
// BOMA MARKET PRO - SUPABASE JS
// ------------------------

// Supabase project config
const SUPABASE_URL = "https://szcqgjkgmqygcbizwmoc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6Y3FnamtnbXF5Z2NiaXp3bW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjA1OTksImV4cCI6MjA4ODM5NjU5OX0.v9uYMCPb4U2fdG_VYvA5h5wKdvzzaEU43xJsDth5LSI";

// Proper Supabase client initialization
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const postBtn = document.getElementById("postBtn");
const previewImg = document.getElementById("preview");
const imageInput = document.getElementById("imageUpload");

// ------------------------
// Image preview
// ------------------------
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => previewImg.src = e.target.result;
  reader.readAsDataURL(file);
});

// ------------------------
// Post a new animal
// ------------------------
postBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];
  if (!file) { alert("Select an image"); return; }

  const animal = {
    name: document.getElementById("name").value,
    age: document.getElementById("age").value,
    price: document.getElementById("price").value,
    location: document.getElementById("location").value,
    phone: document.getElementById("phone").value
  };

  // Basic validation
  if (!animal.name || !animal.age || !animal.price || !animal.location || !animal.phone) {
    alert("Please fill all fields!");
    return;
  }

  try {
    // ------------------------
    // Upload image to Supabase Storage
    // ------------------------
    const fileName = `${Date.now()}_${file.name}`;
    const { data: uploadData, error: uploadError } = await supabaseClient
      .storage
      .from("animals")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicUrlData } = supabaseClient
      .storage
      .from("animals")
      .getPublicUrl(fileName);

    animal.image_url = publicUrlData.publicUrl;

    // ------------------------
    // Insert into database
    // ------------------------
    const { error: dbError } = await supabaseClient.from("animals").insert([animal]);
    if (dbError) throw dbError;

    alert("Animal posted successfully!");

    // Reset form
    imageInput.value = "";
    previewImg.src = "";
    document.getElementById("name").value = "";
    document.getElementById("age").value = "";
    document.getElementById("price").value = "";
    document.getElementById("location").value = "";
    document.getElementById("phone").value = "";

    // Reload animals
    loadAnimals();

  } catch (err) {
    console.error("Post failed:", err);
    alert("Failed to post animal: " + err.message);
  }
});

// ------------------------
// Load all animals
// ------------------------
async function loadAnimals() {
  try {
    let { data: animals, error } = await supabaseClient
      .from("animals")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    displayAnimals(animals);

  } catch (err) {
    console.error("Failed to load animals:", err);
    alert("Failed to load animals: " + err.message);
  }
}

// ------------------------
// Display animals
// ------------------------
function displayAnimals(list) {
  const market = document.getElementById("market");
  market.innerHTML = "";

  if (!list || list.length === 0) {
    market.innerHTML = "<p>No animals posted yet.</p>";
    return;
  }

  list.forEach(a => {
    market.innerHTML += `
      <div class="card">
        <img src="${a.image_url}" alt="${a.name}">
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

// ------------------------
// Filters & search
// ------------------------
async function filterAndSearch() {
  const search = document.getElementById("search").value.toLowerCase();
  const animalVal = document.getElementById("filterAnimal").value;
  const locationVal = document.getElementById("filterLocation").value;

  try {
    let { data: animals, error } = await supabaseClient.from("animals").select("*");
    if (error) throw error;

    animals = animals.filter(a =>
      a.name.toLowerCase().includes(search) &&
      (animalVal === "" || a.name === animalVal) &&
      (locationVal === "" || a.location === locationVal)
    );

    displayAnimals(animals);

  } catch (err) {
    console.error("Filter failed:", err);
  }
}

// Attach search/filter events
document.getElementById("search").addEventListener("keyup", filterAndSearch);
document.getElementById("filterAnimal").addEventListener("change", filterAndSearch);
document.getElementById("filterLocation").addEventListener("change", filterAndSearch);

// Initial load
loadAnimals();
