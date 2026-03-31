function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value, fallback = '—') {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function formatDateTime(value, fallback = '—') {
  if (!value) return fallback;
  return new Date(value).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTypeLabel(type) {
  return { match: 'Match', tournoi: 'Tournoi', entrainement: 'Entraînement', autre: 'Autre' }[type] || type;
}

function getStatusLabel(status) {
  return { planifie: 'Planifié', en_cours: 'En cours', termine: 'Terminé', annule: 'Annulé' }[status] || status;
}

function selectedAttr(condition) {
  return condition ? 'selected' : '';
}

function checkedAttr(condition) {
  return condition ? 'checked' : '';
}

module.exports = {
  escapeHtml,
  formatDate,
  formatDateTime,
  getTypeLabel,
  getStatusLabel,
  selectedAttr,
  checkedAttr
};