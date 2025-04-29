document.addEventListener("DOMContentLoaded", function () {
  /*———————————————————————————————
    1. SLIDER – Điều khiển slider hình ảnh
  ————————————————————————————————*/
  const slidesWrapper = document.querySelector('.slides-wrapper');
  if (slidesWrapper) {
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    const totalSlides = slidesWrapper.children.length;

    function updateSlidePosition() {
      slidesWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Khởi tạo tự động chuyển slide mỗi 5 giây
    function startAutoSlide() {
      return setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlidePosition();
      }, 5000);
    }

    let autoSlide = startAutoSlide();

    function resetAutoSlide() {
      clearInterval(autoSlide);
      autoSlide = startAutoSlide();
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlidePosition();
        resetAutoSlide();
      });
    }
  }

  /*———————————————————————————————
    2. HAMBURGER MENU cho Mobile
  ————————————————————————————————*/
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    // Sử dụng event delegation: ẩn menu khi click vào link
    navMenu.addEventListener('click', (event) => {
      if (event.target.tagName === 'A') {
        navMenu.classList.remove('active');
      }
    });
  }


  /*———————————————————————————————
    4. Toggle Bubble: "Xem thêm / Thu gọn"
  ————————————————————————————————*/
  // Lấy tất cả link để toggle
  document.querySelectorAll('.show-box-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const more = this.previousElementSibling; 
      // Nếu đang ẩn thì hiện và chuyển thành "Thu gọn"
      if (more.style.display === 'none' || !more.style.display) {
        more.style.display = 'inline';
        this.textContent = 'Thu gọn';
      } else {
        // Ngược lại, ẩn đi và trả về "Xem thêm"
        more.style.display = 'none';
        this.textContent = 'Xem thêm';
      }
    });
  });


  /*———————————————————————————————
    6. Lazy Loading cho hình ảnh
  ————————————————————————————————*/
  const lazyImages = document.querySelectorAll("img.lazy");
  if (lazyImages.length > 0) {
    if ('loading' in HTMLImageElement.prototype) {
      lazyImages.forEach(img => {
        img.src = img.getAttribute("data-src");
        img.classList.remove("lazy");
      });
    } else if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            let img = entry.target;
            img.src = img.getAttribute("data-src");
            img.classList.remove("lazy");
            observer.unobserve(img);
          }
        });
      }, { threshold: 0.1 });
      lazyImages.forEach(img => {
        lazyObserver.observe(img);
      });
    } else {
      // Fallback: tải ngay nếu không hỗ trợ lazy loading
      lazyImages.forEach(img => {
        img.src = img.getAttribute("data-src");
        img.classList.remove("lazy");
      });
    }
  }

  /*———————————————————————————————
    7. Intersection Observer cho hiệu ứng scroll-animation
       a. General: Cho các phần tử chung (ngoại trừ bài viết câu chuyện)
  ————————————————————————————————*/
  const generalElements = document.querySelectorAll(".scroll-animation:not(article.story)");
  if (generalElements.length > 0) {
    if ("IntersectionObserver" in window) {
      const generalObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      generalElements.forEach(el => generalObserver.observe(el));
    } else {
      generalElements.forEach(el => el.classList.add("animate"));
    }
  }

  /*———————————————————————————————
    7b. Story Animation: Cho các bài viết "Câu Chuyện Tình Yêu"
         Xử lý stagger animation theo thứ tự hiển thị
  ————————————————————————————————*/
  const storyElementsNodeList = document.querySelectorAll("article.story.scroll-animation");
  const sortedStoryElements = Array.from(storyElementsNodeList).sort((a, b) => {
    return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
  });
  if (sortedStoryElements.length > 0) {
    if ("IntersectionObserver" in window) {
      const storyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Lấy index từ mảng đã sắp xếp để tính delay xuất hiện
            const index = sortedStoryElements.indexOf(entry.target);
            entry.target.style.animationDelay = `${index * 0.1}s`;
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      sortedStoryElements.forEach(el => storyObserver.observe(el));
    } else {
      sortedStoryElements.forEach(el => {
        el.style.animationDelay = "0s";
        el.classList.add("animate");
      });
    }
  }

  /*———————————————————————————————
    8. Observer cho phần "Cặp Đôi" (About Section)
       Chỉ các <figure> có class "scroll-animation" trong #about
  ————————————————————————————————*/
  const coupleElements = document.querySelectorAll("#about figure.scroll-animation");
  if (coupleElements.length > 0) {
    if ("IntersectionObserver" in window) {
      const coupleObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      coupleElements.forEach(el => coupleObserver.observe(el));
    } else {
      coupleElements.forEach(el => el.classList.add("animate"));
    }
  }
});


 /*———————————————————————————————
    9. Rung form sát nhận
  ————————————————————————————————*/

function triggerShake() {
  const btn = document.querySelector('.rsvp-btn');
  if (!btn) return;
  btn.classList.add('shake');
  // remove class sau 1s (0.5s × 2 lần)
  setTimeout(() => btn.classList.remove('shake'), 1000);
}

function scheduleNextShake() {
  // delay ngẫu nhiên 5–20s
  const delay = Math.random() * 15000 + 5000;
  setTimeout(() => {
    triggerShake();
    scheduleNextShake();
  }, delay);
}

scheduleNextShake();



// app.js
// Handles both the periodic notification tooltip and the gift modal behavior

document.addEventListener('DOMContentLoaded', () => {
  /*** Notification Tooltip ***/
  const notify = document.getElementById('loadNotification');
  function showNotify() {
    notify.classList.add('show');
    setTimeout(() => notify.classList.remove('show'), 3000);
    // Schedule next appearance (random between 20s and 40s)
    const next = Math.random() * (40000 - 20000) + 20000;
    setTimeout(showNotify, next);
  }
  // First show after 200ms
  setTimeout(showNotify, 200);

  /*** Gift Modal ***/
  const openBtn  = document.getElementById('open-gift');
  const modal    = document.getElementById('gift-modal');
  const closeBtn = modal.querySelector('.modal-close');

  // Open modal when clicking the gift button
  openBtn.addEventListener('click', e => {
    e.preventDefault();
    modal.classList.add('show');
  });

  // Close modal when clicking the close button
  closeBtn.addEventListener('click', () => modal.classList.remove('show'));

  // Close modal when clicking outside the dialog
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
});




// 11 snow.js
// Animation of falling hearts

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('snow');
  const ctx    = canvas.getContext('2d');
  let w = canvas.width  = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  // Tạo mảng trái tim
  const hearts     = [];
  const heartCount = 20;
  for (let i = 0; i < heartCount; i++) {
    hearts.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3 + 1,     // scale size
      d: Math.random() * heartCount // density
    });
  }

  let angle = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let f of hearts) {
      ctx.fillStyle    = 'rgba(231, 76, 60, 0.8)';
      ctx.font         = `${f.r * 8}px serif`;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('❤', f.x, f.y);
    }
    update();
  }

  function update() {
    angle += 0.01;
    for (let i = 0; i < hearts.length; i++) {
      let f = hearts[i];
      f.y += Math.cos(angle + f.d) + 1 + f.r / 2;
      f.x += Math.sin(angle) * 2;
      if (f.y > h) {
        hearts[i] = { x: Math.random() * w, y: 0, r: f.r, d: f.d };
      }
    }
  }

  (function loop() {
    draw();
    requestAnimationFrame(loop);
  })();

  // Cập nhật khi resize
  window.addEventListener('resize', () => {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
});
