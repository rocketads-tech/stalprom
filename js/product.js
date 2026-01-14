import './app.js';
// Инициализация галереи товара
import Swiper from "swiper/bundle";
import sectionSlider from "./module/section-slider.js";

function initProductGallery() {
  const thumbsEl = document.querySelector(".swiper-thumbs");
  const mainEl = document.querySelector(".swiper-main");

  if (!thumbsEl || !mainEl) return;

  // Миниатюры — обычный freeMode слайдер
  const thumbsSwiper = new Swiper(thumbsEl, {
    spaceBetween: 12,
    slidesPerView: "auto",
    freeMode: true,
    watchSlidesProgress: true,
    slideToClickedSlide: false, // отключаем встроенный клик
    navigation: {
      prevEl: ".gallery-nav--prev",
      nextEl: ".gallery-nav--next",
    },
    breakpoints: {
      640: {
        spaceBetween: 24,
      },
    },
  });

  // Кастомный клик по слайду — прокрутка в начало
  thumbsEl.querySelectorAll(".swiper-slide").forEach((slide, index) => {
    slide.addEventListener("click", () => {
      mainSwiper.slideTo(index);
      thumbsSwiper.slideTo(index, 300);
    });
  });


function updateNavButtons() {
  const totalSlides = thumbsSwiper.slides.length;
  const containerWidth = thumbsSwiper.el.offsetWidth;
  const slideWidth = 150;
  const gap = 24;
  const totalPerSlide = slideWidth + gap;

  // Защита от деления на 0
  if (containerWidth <= 0) return;

  const visibleSlides = Math.floor(containerWidth / totalPerSlide);

  const prevBtn = document.querySelector(".gallery-nav--prev");
  const nextBtn = document.querySelector(".gallery-nav--next");

  console.log(slideWidth);
  

  if (totalSlides <= visibleSlides) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
    nextBtn.style.display = "flex";
  }
}

// Вызываем после инициализации и при изменении размера окна
thumbsSwiper.on("init", updateNavButtons);
// window.addEventListener("resize", updateNavButtons);

  // Основной слайдер — просто привяжите thumbsSwiper
  const mainSwiper = new Swiper(mainEl, {
    thumbs: { swiper: thumbsSwiper },
  });
}

// Запуск
document.addEventListener("DOMContentLoaded", () => {
  initProductGallery();

  // Находим все кнопки "Развернуть"
  const expandButtons = document.querySelectorAll(".product-specs__expand-btn");

  expandButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Ищем скрытый блок ТОЛЬКО внутри той же панели (вкладки)
      const hiddenBlock = this.closest(
        ".product-specs__tab-content"
      )?.querySelector(".product-specs__hidden");
      if (!hiddenBlock) return;

      const isExpanded = this.getAttribute("aria-expanded") === "true";
      const textSpan = this.querySelector("span"); // локальный span

      if (isExpanded) {
        // Скрываем
        hiddenBlock.setAttribute("aria-expanded", "false");
        this.setAttribute("aria-expanded", "false");
        if (textSpan) textSpan.textContent = "Развернуть";
      } else {
        // Показываем
        hiddenBlock.setAttribute("aria-expanded", "true");
        this.setAttribute("aria-expanded", "true");
        if (textSpan) textSpan.textContent = "Свернуть";
      }
    });
  });

  const tabsContainer = document.querySelector(".product-specs__tabs");
  if (!tabsContainer) return;

  const tabButtons = tabsContainer.querySelectorAll(".product-specs__tab");
  const tabContents = document.querySelectorAll(".product-specs__tab-content");

  tabsContainer.addEventListener("click", (e) => {
    const button = e.target.closest(".product-specs__tab");
    if (!button) return;

    const targetTab = button.dataset.tab;

    // Убираем активный класс у всех кнопок
    tabButtons.forEach((btn) => {
      btn.classList.remove("product-specs__tab--active");
      btn.setAttribute("aria-selected", "false");
    });

    // Добавляем активный класс к нажатой
    button.classList.add("product-specs__tab--active");
    button.setAttribute("aria-selected", "true");

    // Скрываем все панели
    tabContents.forEach((content) => {
      content.setAttribute("aria-hidden", "true");
      content.hidden = true;
    });

    // Показываем нужную панель
    const activeContent = document.querySelector(
      `[data-content="${targetTab}"]`
    );
    if (activeContent) {
      activeContent.setAttribute("aria-hidden", "false");
      activeContent.hidden = false;
    }
  });

   sectionSlider(Swiper, document.querySelector(".recommended"));
   sectionSlider(Swiper, document.querySelector(".similar"));
});
