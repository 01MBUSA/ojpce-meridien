const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => links.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

document.querySelector('.newsletter')?.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.currentTarget.querySelector('input');
  if (input.value.trim()) {
    alert("Merci ! Votre adresse a bien été enregistrée. Le système d'envoi devra être connecté à un service de newsletter pour l'activer réellement.");
    input.value = '';
  }
});

document.querySelector('#contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  alert("Merci pour votre message. Le formulaire est prêt visuellement, mais il doit encore être connecté à une adresse e-mail ou à un service de formulaire pour envoyer réellement les messages.");
  e.currentTarget.reset();
});
