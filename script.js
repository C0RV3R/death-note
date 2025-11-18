const book = document.getElementById('book');
const pages = Array.from(document.querySelectorAll('.page'));

const pageSound = new Audio('assets/sounds/page.mp3');

function playPageSound() {
    pageSound.currentTime = 0;
    pageSound.play().catch(error => console.log("Ses çalınamadı (Tarayıcı izni gerekebilir):", error));
}

let current = 0; 
let isAnimating = false;
let startX = 0;
let isDragging = false;
const dragThreshold = 50; 

pages.forEach((page, i) => {
    page.style.zIndex = pages.length - i; 
});

function updateZIndexes() {
    pages.forEach((page, i) => {
        if (i < current) {
            page.style.zIndex = i + 1;
        } else {
            page.style.zIndex = pages.length - i + current; 
        }
    });
}

function nextPage() {
  if (isAnimating || current >= pages.length) return; 
  
  isAnimating = true;
  
  playPageSound();

  const page = pages[current];
  page.style.zIndex = 100; 
  page.classList.add('flipped');
  
  current++;
  
  page.addEventListener('transitionend', () => {
    isAnimating = false;
    updateZIndexes();
  }, { once: true });
}

function prevPage() {
  if (isAnimating || current <= 0) return; 
  
  isAnimating = true;

  playPageSound();
  
  current--; 
  const page = pages[current];
  
  page.style.zIndex = 100; 
  page.classList.remove('flipped');
  
  page.addEventListener('transitionend', () => {
    isAnimating = false;
    updateZIndexes();
  }, { once: true });
}


function getClientX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

function dragStart(e) {
  if (isAnimating) return;
  isDragging = true;
  startX = getClientX(e);
  book.style.cursor = 'grabbing';
  if (e.type === 'touchstart') {
  }
}

function dragMove(e) {
  if (!isDragging) return;
  if (e.cancelable && e.type === 'touchmove') e.preventDefault();
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;
  book.style.cursor = 'grab';
  
  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX; 
  const diff = endX - startX;

  if (diff < -dragThreshold) {
    nextPage();
  } else if (diff > dragThreshold) {
    prevPage();
  }
}

book.addEventListener('mousedown', dragStart);
book.addEventListener('mousemove', dragMove); 
book.addEventListener('mouseup', dragEnd);
document.addEventListener('mouseup', dragEnd); 

book.addEventListener('touchstart', dragStart, { passive: false }); 
book.addEventListener('touchmove', dragMove, { passive: false }); 
book.addEventListener('touchend', dragEnd);