function showModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'block';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.style.display = 'none';
}

window.addEventListener("DOMContentLoaded", () => {
  const interval = setInterval(() => {
    const clickableNodes = document.querySelectorAll('[class*="click-step-"]');

    if (clickableNodes.length > 0) {
      clickableNodes.forEach(node => {
        const match = Array.from(node.classList).find(c => c.startsWith('click-step-'));
        if (match) {
          const stepName = match.replace('click-', '');
          node.style.cursor = 'pointer';
          node.onclick = () => showModal(`modal-${stepName}`);
        }
      });

      clearInterval(interval); // Mermaid is ready
    }
  }, 500);
});

// Optional: click outside modal to close
window.onclick = function (event) {
  document.querySelectorAll(".custom-modal").forEach(modal => {
    if (event.target === modal) modal.style.display = "none";
  });
};
