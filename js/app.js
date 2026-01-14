import stickyHeader from "./module/sticky-header.js";
import mobMenu from './module/mob-menu.js';


document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector("body");
  // Активация пунктов навигации по data-page
  if (!body) return;

  const currentPage = body.dataset.page; // например, "catalog"
  if (!currentPage) return;

  // Находим все ссылки с data-nav
  document.querySelectorAll("a[data-nav]").forEach((link) => {
    const linkPage = link.dataset.nav;
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active"); // на случай, если класс был добавлен ранее
    }
  });

  // --- Добавляем sticky-header ---
  stickyHeader();

  // --- Мобильное меню ---
  mobMenu();

  // --- fix body ---
  // Функция для получения ширины скроллбара
  function getScrollbarWidth() {
    const outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    document.body.appendChild(outer);

    const inner = document.createElement("div");
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    document.body.removeChild(outer);

    return scrollbarWidth;
  }

  // Глобальная переменная для хранения ширины скролла
  let scrollbarWidth = 0;

  // Фиксируем скролл
  // 1. Функция для измерения ширины скроллбара
  function getScrollbarWidth() {
    const div = document.createElement("div");
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.overflow = "scroll";
    div.style.position = "absolute";
    div.style.top = "-9999px";
    document.body.appendChild(div);
    const scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return scrollbarWidth;
  }

  // 2. Наблюдатель за классом no-scroll на body
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains("no-scroll")) {
      // Класс добавлен → фиксируем
      const width = getScrollbarWidth();
      document.body.style.paddingRight = width + "px";
      document.body.style.overflow = "hidden";

      const header = document.querySelector(".header");
      if (header) {
        header.style.paddingRight = width + "px";
      }
    } else {
      // Класс удалён → восстанавливаем
      document.body.style.paddingRight = "";
      document.body.style.overflow = "";

      const header = document.querySelector(".header");
      if (header) {
        header.style.paddingRight = "";
      }
    }
  });

  // Запускаем наблюдение
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });

  // --- Попап менеджер ---

  class PopupManager {
    constructor() {
      this.overlay = document.querySelector(".popup-overlay");
      this.content = this.overlay?.querySelector(".popup__content");
      this.closeBtn = this.overlay?.querySelector(".popup__close");

      if (!this.overlay || !this.content || !this.closeBtn) return;

      this.init();
    }

    init() {
      // Закрытие по кнопке
      this.closeBtn.addEventListener("click", () => this.close());

      // Закрытие по клику на оверлей
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });

      // Закрытие по Esc
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen()) this.close();
      });
    }

    open(htmlContent) {
      this.content.innerHTML = htmlContent;
      body.classList.add("no-scroll"); // для фикса скролла
      this.overlay.classList.add("is-open");
      this.overlay.setAttribute("aria-hidden", "false");

      // Фокус на первый интерактивный элемент (для accessibility)
      const focusable = this.content.querySelector(
        "button, [href], input, select, textarea"
      );
      if (focusable) focusable.focus();
    }

    close() {
      this.overlay.classList.remove("is-open");
      this.overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
      this.content.innerHTML = ""; // очищаем
    }

    isOpen() {
      return this.overlay.classList.contains("is-open");
    }
  }

  // Инициализация
  const popup = new PopupManager();
  window.popup = popup;

  // Универсальный обработчик для всех кнопок с data-popup
  document.addEventListener("click", function (e) {
    const trigger = e.target.closest("[data-popup]");
    if (!trigger) return;

    e.preventDefault();

    const popupType = trigger.dataset.popup;
    const template = document.getElementById("popup-template-" + popupType);

    if (template) {
      popup.open(template.innerHTML);
    }
  });
});