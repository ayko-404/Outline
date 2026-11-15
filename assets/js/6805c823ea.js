
(() => {
  /* карта планшета: убрать кружки-«деревья», дома — светлее с тонким контуром, парки — ровные */
  const img = document.querySelector('.stage .map > img'); if (!img || !img.src.startsWith('data:image/svg+xml;base64,')) return;
  let s = atob(img.src.split(',')[1]);
  s = s.replace(/<circle[^>]*fill="#CFE2C6"[^>]*\/>/g, '')
       .replace(/fill="#F3F2EE"/, 'fill="#F7F6F3"')
       .replace(/rx="4" fill="#(E5E4DD|E8E7E1|EAE9E3)"/g, 'rx="2" fill="#EEEDE9" stroke="#E2E0DA" stroke-width="1"')
       .replace(/rx="5" fill="#E3EDDC"/g, 'rx="3" fill="#E4EEDB"');
  img.src = 'data:image/svg+xml;base64,' + btoa(s);
})();
