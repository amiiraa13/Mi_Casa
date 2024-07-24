
  function openModal() {
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").classList.add("modal-open");
  }

  function closeModal() {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").classList.remove("modal-open");
  }

  // Ajout d'un écouteur pour s'assurer que les scripts sont chargés après le DOM
  document.addEventListener('DOMContentLoaded', function() {
    // Rien à faire ici, les fonctions openModal et closeModal sont déjà définies
  });

