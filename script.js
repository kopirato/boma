// script.js
document.addEventListener("DOMContentLoaded", async () => {

  // ── Supabase Config ───────────────────────────────────────
  const SUPABASE_URL = "https://szcqgjkgmqygcbizwmoc.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6Y3FnamtnbXF5Z2NiaXp3bW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjA1OTksImV4cCI6MjA4ODM5NjU5OX0.v9uYMCPb4U2fdG_VYvA5h5wKdvzzaEU43xJsDth5LSI";

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // ── DOM Elements ──────────────────────────────────────────
  const postBtn       = document.getElementById("postBtn");
  const previewImg    = document.getElementById("preview");
  const imageInput    = document.getElementById("imageUpload");
  const signupBtn     = document.getElementById("signupBtn");
  const loginBtn      = document.getElementById("loginBtn");
  const logoutBtn     = document.getElementById("logoutBtn");
  const authStatus    = document.getElementById("authStatus");
  const sellSection   = document.getElementById("sell");

  // ── Image Preview ─────────────────────────────────────────
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => previewImg.src = e.target.result;
    reader.readAsDataURL(file);
  });

  // ── Auth UI Update ────────────────────────────────────────
  async function updateAuthUI() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      authStatus.textContent = `Logged in as ${session.user.email}`;
      logoutBtn.style.display = "inline-block";
      if (sellSection) sellSection.style.display = "block"; // show sell form
    } else {
      authStatus.textContent = "Not logged in — sign up / log in to post livestock";
      logoutBtn.style.display = "none";
      if (sellSection) sellSection.style.display = "none"; // hide sell form
    }
    loadAnimals(); // refresh list
  }

  // Initial auth check
  updateAuthUI();

  // Listen for login/logout/signup changes
  supabase.auth.onAuthStateChange(() => {
    updateAuthUI();
  });

  // ── Sign Up ───────────────────────────────────────────────
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) return alert("Please enter email and password");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) alert("Sign up failed: " + error.message);
    else alert("Sign up successful! You can now log in.");
  });

  // ── Log In ────────────────────────────────────────────────
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) return alert("Please enter email and password");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) alert("Login failed: " + error.message);
    else {
      // updateAuthUI() auto-called via onAuthStateChange
    }
  });

  // ── Log Out ───────────────────────────────────────────────
  logoutBtn.addEventListener("click", async () => {
    await supabase.auth.signOut();
    // updateAuthUI() auto-called
  });

  // ── Post Animal ───────────────────────────────────────────
  postBtn.addEventListener("click", async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      alert("Please log in to post an animal");
      return;
    }

    const file = imageInput.files[0];
    if (!file) return alert("Please select an image");

    const animal = {
      name:     document.getElementById("name").value,
      age:      document.getElementById("age").value,
      price:    document.getElementById("price").value,
      location: document.getElementById("location").value,
      phone:    document.getElementById("phone").value,
      user_id:  session.user.id   // ties post to logged-in user
    };

    if (!animal.name || !animal.age || !animal.price || !animal.location || !animal.phone) {
      return alert("Please fill all fields!");
    }

    try {
      // Upload image
      const fileName = `\( {Date.now()}_ \){file.name.replace(/\s+/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from("animals")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      // Get public URL (works if bucket is public)
      const { data: { publicUrl } } = supabase.storage
        .from("animals")
        .getPublicUrl(fileName);

      animal.image_url = publicUrl;

      // Save to database
      const { error: insertError } = await supabase
        .from("animals")
        .insert([animal]);

      if (insertError) throw insertError;

      alert("Animal posted successfully!");

      // Reset form
      imageInput.value = "";
      previewImg.src = "";
      document.getElementById("name").value = "";
      document.getElementById("age").value = "";
      document.getElementById("price").value = "";
      document.getElementById("location").value = "";
      document.getElementById("phone").value = "";

      loadAnimals();

    } catch (err) {
      console.error("Post error:", err);
      alert("Failed to post: " + (err.message || "Unknown error"));
    }
  });

  // ── Load & Display Animals ────────────────────────────────
  async function loadAnimals() {
    try {
      const { data: animals, error } = await supabase
        .from("animals")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      displayAnimals(animals || []);
    } catch (err) {
      console.error("Load failed:", err);
      document.getElementById("market").innerHTML = "<p>Error loading livestock. Please try again.</p>";
    }
  }

  function displayAnimals(list) {
    const market = document.getElementById("market");
    market.innerHTML = "<h2>Livestock Market</h2>";

    if (list.length === 0) {
      market.innerHTML += "<p>No animals posted yet.</p>";
      return;
    }

    list.forEach(a => {
      market.innerHTML += `
        <div class="card">
          <img src="\( {a.image_url || 'placeholder.jpg'}" alt=" \){a.name}" onerror="this.src='placeholder.jpg'">
          <h3>${a.name}</h3>
          <p>Age: ${a.age}</p>
          <p>Price: KES ${a.price}</p>
          <p>Location: ${a.location}</p>
          <a href="https://wa.me/${a.phone.replace(/\D/g,'')}" target="_blank" rel="noopener">
            <button>Contact Seller</button>
          </a>
        </div>
      `;
    });
  }

  // ── Filters & Search ──────────────────────────────────────
  async function filterAndSearch() {
    const search = document.getElementById("search").value.toLowerCase().trim();
    const animalType = document.getElementById("filterAnimal").value;
    const loc = document.getElementById("filterLocation").value;

    try {
      let query = supabase.from("animals").select("*");

      if (search)   query = query.ilike("name", `%${search}%`);
      if (animalType) query = query.eq("name", animalType);
      if (loc)      query = query.eq("location", loc);

      const { data: animals, error } = await query.order("id", { ascending: false });

      if (error) throw error;
      displayAnimals(animals || []);
    } catch (err) {
      console.error("Filter error:", err);
    }
  }

  document.getElementById("search").addEventListener("input", filterAndSearch);
  document.getElementById("filterAnimal").addEventListener("change", filterAndSearch);
  document.getElementById("filterLocation").addEventListener("change", filterAndSearch);

  // Initial load
  loadAnimals();
});
