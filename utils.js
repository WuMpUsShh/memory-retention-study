
// ---- Navigation Guard Utilities ----
const GUARD_KEYS = {
  progressed: 'mr_progressed', // set after leaving story
  completed:  'mr_completed'   // set after submitting quiz
};

function hardenAgainstBackNavigation() {
  // Push a new state and trap back/forward
  history.pushState(null, document.title, location.href);
  window.addEventListener('popstate', () => {
    history.pushState(null, document.title, location.href);
    alert('Back navigation is disabled during the test.');
  });

  // Optional: discourage refresh & context menu
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    const blocked = (
      e.key === 'F5' || // refresh
      (e.ctrlKey && (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'p')) || // Ctrl+R / Ctrl+P
      (e.metaKey && (e.key.toLowerCase() === 'r' || e.key.toLowerCase() === 'p'))
    );
    if (blocked) { e.preventDefault(); alert('This action is disabled during the test.'); }
  });
}

function requireProgressFlag() {
  if (!localStorage.getItem(GUARD_KEYS.progressed)) {
    // If user tries to access quiz without finishing story
    location.replace('./index.html');
  }
}

function requireNotCompleted() {
  if (localStorage.getItem(GUARD_KEYS.completed)) {
    alert('You have already completed the test.');
    location.replace('./completed.html');
  }
}

function markProgressed() {
  localStorage.setItem(GUARD_KEYS.progressed, '1');
}

function markCompleted() {
  localStorage.setItem(GUARD_KEYS.completed, '1');
}

// ---- Simple countdown timer ----
function startCountdown(seconds, onTick, onExpire) {
  let remaining = seconds;
  onTick?.(remaining);
  const iv = setInterval(() => {
    remaining -= 1;
    onTick?.(remaining);
    if (remaining <= 0) {
      clearInterval(iv);
      onExpire?.();
    }
  }, 1000);
  return () => clearInterval(iv);
}
