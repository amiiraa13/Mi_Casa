function openModal(pieceName, pieceId) {
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").style.display = "block";
    document.getElementById("modal-title").innerText = pieceName;

    const form = document.getElementById("menageForm");
    form.action = `/piece/${pieceId}/menage`;

    // Efface les anciennes tâches
    const menageList = document.getElementById("menage-list");
    menageList.innerHTML = "";

    // Récupère les données des tâches de ménage associées à la pièce
    fetch(`/piece/${pieceId}/menages`)
        .then(response => response.json())
        .then(data => {
            data.menages.forEach(menage => {
                const li = document.createElement("li");
                li.textContent = `${menage.nom} - ${new Date(menage.recurence).toLocaleDateString()}`;
                menageList.appendChild(li);
            });
        })
        .catch(error => console.error("Erreur:", error));
}

function closeModal() {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").style.display = "none";
}

document.querySelectorAll(".open-modal").forEach(button => {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        const pieceName = this.getAttribute("data-piece");
        const pieceId = this.getAttribute("data-piece-id");
        openModal(pieceName, pieceId);
    });
});

document.querySelector(".overlay").addEventListener("click", closeModal);

