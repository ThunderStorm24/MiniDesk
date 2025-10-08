let topZIndex = 1000;

function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  // --- MOBILE ---
  if (window.innerWidth <= 900) {
  const sheet = document.getElementById('mobile-sheet');
  const title = document.getElementById('sheet-title');
  const content = document.getElementById('sheet-content');

  const headerEl = win.querySelector('.window-header');
  const bodyEl = win.querySelector('.window-body');

  // set tytuł
  title.textContent = headerEl ? headerEl.textContent.replace('✖','').trim() : id;

  // oryginalny element --> sheet zamiast cloneNode/innerHTML
  content.innerHTML = '';         
  content.appendChild(bodyEl);    

  // ID okna dla CSS
  sheet.setAttribute('data-window', id);

  // mobile sheet
  sheet.classList.add('active');

  // hide desktop windows
  document.querySelectorAll('.window').forEach(w => w.style.display = 'none');

  return;
}

  // --- DESKTOP ---
  if (win.style.display === 'flex') {
    win.style.animation = 'windowOpen 0.2s ease';
    return;
  }

  win.style.display = 'flex';
  win.style.animation = 'windowOpen 0.2s ease forwards';
  topZIndex++;
  win.style.zIndex = topZIndex;

  const offset = 30, baseTop = 100, baseLeft = 100;
  if (typeof openWindow.openCount === 'undefined') openWindow.openCount = 0;

  win.style.top = (baseTop + offset * openWindow.openCount) + 'px';
  win.style.left = (baseLeft + offset * openWindow.openCount) + 'px';

  openWindow.openCount++;
  if (openWindow.openCount > 4) openWindow.openCount = 0;
}

function closeSheet() {
  const sheet = document.getElementById("mobile-sheet");
  const content = document.getElementById("sheet-content");

  const bodyEl = content.firstElementChild;
  if(bodyEl){
    const originalWindow = document.getElementById(sheet.dataset.window);
    originalWindow.appendChild(bodyEl); 
  }

  sheet.classList.remove("active");
}

function closeWindow(id) {
	const win = document.getElementById(id);
	
	if (soundEnabled) closeSound.play();

  win.style.animation = 'windowClose 0.2s ease forwards';

  setTimeout(() => {
    win.style.display = 'none';
  }, 200);
}

// Dragging logic
document.querySelectorAll('.window').forEach(win => {
  const header = win.querySelector('.window-header');
  let isDragging = false;
  let offsetX = 0, offsetY = 0;

header.addEventListener('mousedown', (e) => {
  if (e.target.tagName === 'BUTTON') return; // ignoruj kliknięcie w ✖

  topZIndex++;
  win.style.zIndex = topZIndex;

  isDragging = true;
  const rect = win.getBoundingClientRect();
  offsetX = e.clientX - rect.left;
  offsetY = e.clientY - rect.top;
  document.body.style.userSelect = 'none';
});
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const winWidth = win.offsetWidth;
  const winHeight = win.offsetHeight;

  let newLeft = e.clientX - offsetX;
  let newTop = e.clientY - offsetY;

  // Ograniczamy ruch do viewport (przeglądarka)
  const maxLeft = window.innerWidth - winWidth;
  const maxTop = window.innerHeight - winHeight;

  newLeft = Math.min(Math.max(newLeft, 0), maxLeft);
  newTop = Math.min(Math.max(newTop, 0), maxTop);

  // Przypisz przesunięcie względem .desktop
  const desktopRect = document.querySelector('.desktop').getBoundingClientRect();
  win.style.left = (newLeft - desktopRect.left) + 'px';
  win.style.top = (newTop - desktopRect.top) + 'px';
});

  document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = '';
  });
});

const clickSound = new Audio("assets/sounds/click.wav");
const switchSound = new Audio("assets/sounds/switch.wav");
const closeSound = new Audio("assets/sounds/close.wav");

// sound
let soundEnabled = true;

document.getElementById("sound-switch").addEventListener("change", function () {
  soundEnabled = this.checked;
});

//theme
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const themeSwitch = document.getElementById("theme-switch");

// Ustawienie początkowe tak jak w systemie uzytkownikaa
if (prefersDark) {
  document.body.classList.add("dark-theme");
  themeSwitch.checked = true;
} else {
  document.body.classList.remove("dark-theme");
  themeSwitch.checked = false;
}

// Obsługa zmiany przez uzytkownika
themeSwitch.addEventListener("change", function () {
  document.body.classList.toggle("dark-theme", this.checked);
});

// Dźwięk do ikon
document.querySelectorAll(".icon").forEach(icon => {
  icon.addEventListener("click", () => {
    if (soundEnabled) {
      clickSound.currentTime = 0;
      clickSound.play();
    }
  });
});

document.querySelectorAll('.switch-wrapper input').forEach(input => {
  input.addEventListener('change', () => {
    if (soundEnabled) switchSound.play();
    
    if (input.id === 'theme-toggle') {
      document.body.classList.toggle('dark-theme');
    }

    if (input.id === 'sound-toggle') {
      soundEnabled = input.checked;
    }
  });
});

function turnOffDesktop() {
	document.querySelectorAll('.window').forEach(win => {
    win.style.display = 'none';
  });
}

const powerBtn = document.getElementById('powerBtn');
  const screen = document.getElementById('screen');

  powerBtn.addEventListener('click', () => {
    screen.classList.toggle('off');
	turnOffDesktop();
  });

