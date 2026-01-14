import './app.js';
import { Tabs } from "./module/tabs.js";

document.addEventListener("DOMContentLoaded", () => {
  // Табы
  const tabsContainer = document.querySelector(
    ".section-account .tabs-wrapper"
  );
  if (tabsContainer) {
    new Tabs(tabsContainer);
  }

  // пагинация
  function renderPagination(
    pagContainer,
    totalItems,
    currentPage = 1,
    itemsPerPage = 8
  ) {
    const container = document.getElementById(pagContainer);
    if (!container) return;

    if (totalItems <= itemsPerPage) {
      container.innerHTML = "";
      container.style.display = "none";
      return;
    }

    container.style.display = "flex";

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    container.innerHTML = "";

    // Определяем, мобильный ли режим
    const isMobile = window.innerWidth < 768;
    const maxVisible = isMobile ? 4 : 7; // максимум кнопок с номерами

    // --- Кнопки навигации ---

    // « (в начало)
    const firstBtn = document.createElement("button");
    firstBtn.innerHTML =
      '<svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.7777 3.09005L13.7826 2.1001L8.80664 7.04983L13.7826 11.9996L14.7778 11.0096L10.797 7.04983L14.7777 3.09005Z" fill="currentColor"/><path d="M9.1481 3.09005L8.15292 2.1001L3.177 7.04983L8.15294 11.9996L9.14813 11.0096L5.16737 7.04983L9.1481 3.09005Z" fill="currentColor"/></svg>';
    firstBtn.disabled = currentPage === 1;
    firstBtn.classList.add("pagination-btn", "pagination-btn--first");
    if (firstBtn.disabled) firstBtn.classList.add("disabled");
    firstBtn.addEventListener("click", () => updatePage(1));
    container.appendChild(firstBtn);

    // < (назад)
    const prevBtn = document.createElement("button");
    prevBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.80003 3.09005L8.81008 2.1001L3.86035 7.04983L8.8101 11.9996L9.80005 11.0096L5.84024 7.04983L9.80003 3.09005Z" fill="currentColor"/></svg>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.classList.add("pagination-btn", "pagination-btn--prev");
    if (prevBtn.disabled) prevBtn.classList.add("disabled");
    prevBtn.addEventListener("click", () => updatePage(currentPage - 1));
    container.appendChild(prevBtn);

    // --- Номера страниц ---

    const pagesToShow = new Set();
    pagesToShow.add(1); // всегда первая
    pagesToShow.add(totalPages); // всегда последняя
    pagesToShow.add(currentPage); // всегда текущая

    // Добавляем страницы вокруг текущей
    const range = Math.floor((maxVisible - 3) / 2); // -3 = первая, текущая, последняя
    for (let i = 1; i <= range; i++) {
      if (currentPage - i > 1) pagesToShow.add(currentPage - i);
      if (currentPage + i < totalPages) pagesToShow.add(currentPage + i);
    }

    // Сортируем
    const sortedPages = Array.from(pagesToShow).sort((a, b) => a - b);

    // Ограничиваем до maxVisible
    if (sortedPages.length > maxVisible) {
      const limited = new Set();
      limited.add(1);
      limited.add(currentPage);
      limited.add(totalPages);

      // Добавляем по одному слева и справа от текущей, пока не наберём maxVisible
      let left = currentPage - 1;
      let right = currentPage + 1;
      while (limited.size < maxVisible) {
        if (left > 1) limited.add(left--);
        if (limited.size >= maxVisible) break;
        if (right < totalPages) limited.add(right++);
        if (limited.size >= maxVisible) break;
      }
      sortedPages = Array.from(limited).sort((a, b) => a - b);
    }

    // Рендерим номера
    let prevPage = 0;
    sortedPages.forEach((page) => {
      // Добавляем "..." если есть разрыв
      if (prevPage > 0 && page - prevPage > 1) {
        const ellipsis = document.createElement("span");
        ellipsis.className = "ellipsis";
        ellipsis.textContent = "…";
        container.appendChild(ellipsis);
      }

      const pageBtn = document.createElement("button");
      pageBtn.textContent = page;
      pageBtn.className = "page-number";
      if (page === currentPage) pageBtn.classList.add("active");
      pageBtn.addEventListener("click", () => updatePage(page));
      container.appendChild(pageBtn);

      prevPage = page;
    });

    // --- Кнопки навигации (справа) ---

    // > (вперёд)
    const nextBtn = document.createElement("button");
    nextBtn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.19997 3.09005L5.18992 2.1001L10.1396 7.04983L5.1899 11.9996L4.19995 11.0096L8.15976 7.04983L4.19997 3.09005Z" fill="currentColor"/></svg>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.classList.add("pagination-btn", "pagination-btn--next");
    if (nextBtn.disabled) nextBtn.classList.add("disabled");
    nextBtn.addEventListener("click", () => updatePage(currentPage + 1));
    container.appendChild(nextBtn);

    // » (в конец)
    const lastBtn = document.createElement("button");
    lastBtn.innerHTML =
      '<svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.22226 3.09005L5.21745 2.1001L10.1934 7.04983L5.21742 11.9996L4.22224 11.0096L8.20299 7.04983L4.22226 3.09005Z" fill="currentColor"/><path d="M9.8519 3.09005L10.8471 2.1001L15.823 7.04983L10.8471 11.9996L9.85187 11.0096L13.8326 7.04983L9.8519 3.09005Z" fill="currentColor"/></svg>';
    lastBtn.disabled = currentPage === totalPages;
    lastBtn.classList.add("pagination-btn", "pagination-btn--last");
    if (lastBtn.disabled) lastBtn.classList.add("disabled");
    lastBtn.addEventListener("click", () => updatePage(totalPages));
    container.appendChild(lastBtn);
  }

  function updatePage(pageNumber) {
    console.log("Переход на страницу:", pageNumber);
    // Здесь будет AJAX или переход
    renderPagination("pagination-orders", 20, pageNumber);
    renderPagination("pagination-canceled-orders", 10, pageNumber);
    renderPagination("pagination-all-orders", 30, pageNumber);
  }

  renderPagination("pagination-orders", 20, 1);
  renderPagination("pagination-canceled-orders", 10, 1);
  renderPagination("pagination-all-orders", 30, 1);

  // глаз на пароле
  // SVG-строки
  // Иконка "скрыто" — глаз с зрачком и ресницами
  const eyeOffIcon = `
    <svg viewBox="0 0 36 36" focusable="false" aria-hidden="true" role="img"><path fill-rule="evenodd" d="M14.573,9.44A9.215,9.215,0,0,1,26.56,21.427l2.945,2.945C32.1,22.183,33.75,19.76,33.75,18.36c0-2.364-4.214-7.341-9.137-9.78A14.972,14.972,0,0,0,18,6.937a14.36,14.36,0,0,0-4.989.941Z"></path><path fill-rule="evenodd" d="M33.794,32.058,22.328,20.592A5.022,5.022,0,0,0,23.062,18a4.712,4.712,0,0,0-.174-1.2,2.625,2.625,0,0,1-2.221,1.278A2.667,2.667,0,0,1,18,15.417a2.632,2.632,0,0,1,1.35-2.27A4.945,4.945,0,0,0,18,12.938a5.022,5.022,0,0,0-2.592.734L3.942,2.206a.819.819,0,0,0-1.157,0l-.578.579a.817.817,0,0,0,0,1.157l6.346,6.346c-3.816,2.74-6.3,6.418-6.3,8.072,0,3,7.458,10.7,15.686,10.7a16.455,16.455,0,0,0,7.444-1.948l6.679,6.679a.817.817,0,0,0,1.157,0l.578-.578A.818.818,0,0,0,33.794,32.058ZM18,27.225a9.2,9.2,0,0,1-7.321-14.811l2.994,2.994A5.008,5.008,0,0,0,12.938,18,5.062,5.062,0,0,0,18,23.063a5.009,5.009,0,0,0,2.592-.736l2.994,2.994A9.144,9.144,0,0,1,18,27.225Z"></path></svg>
  `;

  // Иконка "показать" — глаз без зрачка, только контур с ресницами
  const eyeIcon = `
    <svg viewBox="0 0 36 36" focusable="false" aria-hidden="true" role="img"><path fill-rule="evenodd" d="M24.613,8.58A14.972,14.972,0,0,0,18,6.937c-8.664,0-15.75,8.625-15.75,11.423,0,3,7.458,10.7,15.686,10.7,8.3,0,15.814-7.706,15.814-10.7C33.75,16,29.536,11.019,24.613,8.58ZM18,27.225A9.225,9.225,0,1,1,27.225,18,9.225,9.225,0,0,1,18,27.225Z"></path><path fill-rule="evenodd" d="M20.667,18.083A2.667,2.667,0,0,1,18,15.417a2.632,2.632,0,0,1,1.35-2.27A4.939,4.939,0,0,0,18,12.938,5.063,5.063,0,1,0,23.063,18a4.713,4.713,0,0,0-.175-1.2A2.625,2.625,0,0,1,20.667,18.083Z"></path></svg>
  `;

  const toggleButtons = document.querySelectorAll(
    ".section-account__field-password-toggle"
  );

  toggleButtons.forEach((btn) => {
    const input = btn
      .closest(".section-account__field")
      .querySelector('input[type="password"], input[type="text"]');
    if (!input) return;

    // Устанавливаем начальную иконку (глаз с зрачком — пароль скрыт)
    btn.innerHTML = eyeOffIcon;
    btn.setAttribute("aria-label", "Показать пароль");
    btn.setAttribute("data-visible", "false");

    btn.addEventListener("click", () => {
      const isVisible = btn.getAttribute("data-visible") === "true";
      const newType = isVisible ? "password" : "text";
      const newIcon = isVisible ? eyeOffIcon : eyeIcon;
      const newLabel = isVisible ? "Показать пароль" : "Скрыть пароль";

      input.type = newType;
      btn.innerHTML = newIcon;
      btn.setAttribute("aria-label", newLabel);
      btn.setAttribute("data-visible", String(!isVisible));
    });
  });
});