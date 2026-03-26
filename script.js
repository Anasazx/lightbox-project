var defaultConfig = {
  hero_title: "Illuminez Votre Monde",
  hero_subtitle:
    "Découvrez nos lampes LED modernes pour transformer votre espace.",
  about_title: "À propos de LightBox",
  about_text:
    "LightBox vous propose une sélection de lampes LED colorées, modernes et décoratives pour ajouter de la magie à votre chambre, salon ou bureau.",
  footer_email: "contact@lightbox.tn",
  footer_whatsapp: "+216 71 000 000",
};

/*  PARTICLES  */
var particlesContainer = document.getElementById("particles");
for (let i = 0; i < 50; i++) {
  var particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.animationDelay = Math.random() * 8 + "s";
  particle.style.animationDuration = Math.random() * 4 + 6 + "s";
  particlesContainer.appendChild(particle);
}


document
  .getElementById("inscription-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    let valid = true;

    
    var email = document.getElementById("email");
    var tel = document.getElementById("telephone");
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirm-password");
    var conditions = document.getElementById("conditions");

    if (!email.value.includes("@")) {
      showError(email, "Email invalide");
      valid = false;
    } else clearError(email);

    if (tel.value !== "" && tel.value.length < 8) {
      showError(tel, "Téléphone invalide");
      valid = false;
    } else clearError(tel);

    if (password.value.length < 8) {
      showError(password, "Mot de passe minimum 8 caractères");
      valid = false;
    } else clearError(password);

    
    let hasUppercase = false;
    let hasNumber = false;
    let hasSpecial = false;

    for (let i = 0; i < password.value.length; i++) {
      let c = password.value[i];

      if (c >= "A" && c <= "Z") hasUppercase = true;
      if (c >= "0" && c <= "9") hasNumber = true;

      if (
        c === "!" ||
        c === "@" ||
        c === "#" ||
        c === "$" ||
        c === "%" ||
        c === "^" ||
        c === "&" ||
        c === "*" ||
        c === "(" ||
        c === ")" ||
        c === "_" ||
        c === "+" ||
        c === "." ||
        c === "," ||
        c === "?" ||
        c === "-"
      ) {
        hasSpecial = true;
      }
    }

    if (!hasUppercase) {
      showError(password, "Le mot de passe doit contenir une majuscule");
      valid = false;
    } else if (!hasNumber) {
      showError(password, "Le mot de passe doit contenir un chiffre");
      valid = false;
    } else if (!hasSpecial) {
      showError(password, "Le mot de passe doit contenir un caractère spécial");
      valid = false;
    }

    if (password.value !== confirmPassword.value) {
      showError(confirmPassword, "Les mots de passe ne correspondent pas");
      valid = false;
    } else clearError(confirmPassword);

    if (!conditions.checked) {
      alert("Vous devez accepter les conditions !");
      valid = false;
    }

    if (valid) {
      alert("✅ Inscription réussie !");
      this.reset();
      document.getElementById("password-strength").style.width = "0%";
    }
  });


function showError(input, message) {
  input.nextElementSibling.textContent = message;
}
function clearError(input) {
  input.nextElementSibling.textContent = "";
}


document.getElementById("password").addEventListener("input", function () {
  var bar = document.getElementById("password-strength");
  var v = this.value;

  if (v.length < 6) {
    bar.style.width = "25%";
    bar.style.background = "red";
  } else if (v.length < 8) {
    bar.style.width = "50%";
    bar.style.background = "orange";
  } else {
    bar.style.width = "100%";
    bar.style.background = "green";
  }
});


function showPage(pageName) {
  var pages = document.querySelectorAll(".page");
  var navLinks = document.querySelectorAll("nav a");

  pages.forEach(p => p.classList.remove("active"));
  navLinks.forEach(l => l.classList.remove("active"));

  document.getElementById("page-" + pageName).classList.add("active");

  var activeLink = Array.from(navLinks).find(link =>
    link.textContent.toLowerCase().includes(pageName.toLowerCase())
  );
  if (activeLink) activeLink.classList.add("active");

  if (pageName === "panier") afficherPanier();

  window.scrollTo({ top: 0, behavior: "smooth" });
}


let panier = [];
let total = 0;

function savePanier() {
  localStorage.setItem("lightbox_panier", JSON.stringify(panier));
}

function loadPanier() {
  var saved = localStorage.getItem("lightbox_panier");
  panier = saved ? JSON.parse(saved) : [];
  if (!Array.isArray(panier)) panier = [];
}
loadPanier();

var boutons = document.getElementsByClassName("add-btn");

for (let i = 0; i < boutons.length; i++) {
  boutons[i].onclick = function () {
    var parent = this.parentElement;
    var qtyInput = parent.querySelector(".qty");

    var nom = qtyInput.dataset.name;
    var prix = parseInt(qtyInput.dataset.price, 10);
    let quantite = parseInt(qtyInput.value, 10);

    if (isNaN(quantite) || quantite < 1) quantite = 1;
    if (quantite > 99) quantite = 99;

    let existe = false;

    for (let j = 0; j < panier.length; j++) {
      if (panier[j].nom === nom) {
        panier[j].quantite += quantite;
        existe = true;
        break;
      }
    }

    if (!existe) panier.push({ nom, prix, quantite });

    savePanier();
    afficherPanier();
    showPage("panier");
  };
}

function afficherPanier() {
  var zone = document.getElementById("panier-items");
  var totalSpan = document.getElementById("panier-total");

  zone.innerHTML = "";
  total = 0;

  if (panier.length === 0) {
    zone.innerHTML = "<p>Votre panier est vide.</p>";
    totalSpan.innerText = "0";
    return;
  }

  panier.forEach((item, index) => {
    var sousTotal = item.prix * item.quantite;
    total += sousTotal;

    zone.innerHTML += `
      <div class="panier-ligne">
        <strong>${item.nom}</strong><br>
        Prix : ${item.prix} DT<br>
        Quantité :
        <input type="number" min="1" max="99"
          value="${item.quantite}"
          onchange="modifierQuantite(${index}, this.value)">
        <br>Sous-total : ${sousTotal} DT<br>
        <button onclick="supprimerProduit(${index})">Supprimer</button>
        <hr>
      </div>
    `;
  });

  totalSpan.innerText = total;
}

function modifierQuantite(index, value) {
  let q = parseInt(value, 10);
  if (isNaN(q) || q < 1) q = 1;
  if (q > 99) q = 99;

  panier[index].quantite = q;
  savePanier();
  afficherPanier();
}

function supprimerProduit(index) {
  panier.splice(index, 1);
  savePanier();
  afficherPanier();
}

document.getElementById("valider").onclick = function () {
  if (panier.length === 0) {
    alert("Votre panier est vide !");
    return;
  }
  alert("✅ Commande validée !");
  panier = [];
  savePanier();
  afficherPanier();
};

document.getElementById("reset-panier").onclick = function () {
  panier = [];
  savePanier();
  afficherPanier();
};
