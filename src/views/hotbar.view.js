const { escapeHtml } = require('./view.utils');

function getNavLinksByRole(user) {
  const links = [];

  // ── ADMIN ──────────────────────────────────────────────────────
  if (user.estAdmin) {
    links.push(
      { href: '/admin', label: 'Dashboard Admin', isAdmin: true },
      { href: '/admin/licences', label: 'Licences' },
      { href: '/admin/joueurs', label: 'Joueurs' },
      { href: '/admin/coachs', label: 'Coachs' },
      { href: '/equipe', label: 'Les équipes' },
      { href: '/calendrier', label: 'Calendrier' },
      { href: '/evenements', label: 'Créer événement' }
    );
  }
  // ── COACH ──────────────────────────────────────────────────────
  else if (user.role === 'coach') {
    links.push(
      { href: '/coach/equipe', label: 'Mon équipe' },
      { href: '/coach/joueurs', label: 'Mes joueurs' },
      { href: '/coach/licences', label: 'Mes licences' },
      { href: '/coach/events', label: 'Mes événements' },
      { href: '/calendrier', label: 'Calendrier' },
      { href: '/evenements', label: 'Créer événement' }
    );
  }
  // ── JOUEUR (licencie) ──────────────────────────────────────────
  else if (user.role === 'licencie') {
    links.push(
      { href: '/joueur/equipe', label: 'Mon équipe' },
      { href: '/joueur/licences', label: 'Mes licences' },
      { href: '/joueur/events', label: 'Mes événements' },
      { href: '/calendrier', label: 'Calendrier' }
    );
  }

  // ── COMMUN À TOUS (sauf admin) ──────────────────────────────
  if (!user.estAdmin) {
    links.push({ href: '/equipe', label: 'Les équipes' });
  }

  return links;
}

function renderHotbar(user) {
  if (user) {
    const navLinks = getNavLinksByRole(user);
    const linksHtml = navLinks
      .map(l => `<a href="${l.href}"${l.isAdmin ? ' class="admin-link"' : ''}>${l.label}</a>`)
      .join('');

    return `<nav class="menu" aria-label="Navigation principale">
      ${linksHtml}
      <label class="switch" for="theme-switch" aria-label="Activer le mode sombre">
        <input id="theme-switch" type="checkbox" role="switch" aria-label="Activer le mode sombre">
        <span class="slider" aria-hidden="true"></span>
      </label>
      <a href="/dashboard" class="user-link">${escapeHtml(user.prenom)}</a>
    </nav>`;
  }

  return `<nav class="menu" aria-label="Navigation principale">
      <a href="/equipe">Les équipes</a>
      <a href="/calendrier">Calendrier</a>
      <label class="switch" for="theme-switch" aria-label="Activer le mode sombre">
        <input id="theme-switch" type="checkbox" role="switch" aria-label="Activer le mode sombre">
        <span class="slider" aria-hidden="true"></span>
      </label>
      <a href="/connexion" class="cta-btn">Connexion</a>
    </nav>`;
}

module.exports = { renderHotbar };
