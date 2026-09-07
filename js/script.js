const toggle = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => links?.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => links?.classList.remove('open')));

// Affiche une confirmation après retour du formulaire de contact.
if (new URLSearchParams(window.location.search).get('sent') === '1') {
  const notice = document.createElement('div');
  notice.setAttribute('role', 'status');
  notice.style.cssText = 'max-width:1100px;margin:18px auto;padding:14px 18px;border-radius:8px;background:#e9f7ee;color:#164f27;font-weight:600;';
  notice.textContent = 'Merci. Votre message a été envoyé avec succès.';
  document.querySelector('main')?.prepend(notice);
}

// Newsletter : transmission à l’adresse officielle via FormSubmit.
const newsletter = document.querySelector('.newsletter');
newsletter?.addEventListener('submit', e => {
  e.preventDefault();
  const input = newsletter.querySelector('input[type="email"]');
  const email = input?.value.trim();
  if (!email) return;
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://formsubmit.co/ojpcemeridien@gmail.com';
  form.innerHTML = `<input type="hidden" name="_subject" value="Nouvelle inscription newsletter OJPCE/MERIDIEN"><input type="hidden" name="_captcha" value="true"><input type="hidden" name="Email" value="${email.replace(/&/g,'&amp;').replace(/"/g,'&quot;')}"><input type="hidden" name="_template" value="table">`;
  document.body.appendChild(form);
  form.submit();
});
