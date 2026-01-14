import './app.js';
import ImagePopup from './module/imagePopup.js';

document.addEventListener('DOMContentLoaded', function () {
  function renderPagination(totalItems, currentPage = 1, itemsPerPage = 8) {
    const container = document.getElementById("pagination-container");
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
    renderPagination(30, pageNumber); // ← замените 100 на реальное totalItems
  }

  // Пример использования
  // Предположим, у нас 100 товаров
  renderPagination(30, 1); // totalItems=100, currentPage=1

   new ImagePopup();
});