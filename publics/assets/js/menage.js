
function openModal(pieceName) {
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".modal").classList.add("modal-open");
    document.getElementById("modal-title").textContent = pieceName;
}

function closeModal() {
    document.querySelector(".overlay").style.display = "none";
    document.querySelector(".modal").classList.remove("modal-open");
}

document.addEventListener('DOMContentLoaded', function() {
    var modalTriggers = document.querySelectorAll('.open-modal');
    modalTriggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(event) {
            event.preventDefault();
            var pieceName = this.getAttribute('data-piece');
            openModal(pieceName);
        });
    });
});