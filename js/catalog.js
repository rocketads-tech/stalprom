import "./app.js";
import accordionsFilters from "./module/accordions-filters.js";
import filters from "./module/filters.js";
import formFilters from "./module/form-filters.js";
import paginationProductsGrid from "./module/pagination-products-grid.js";
import sort from "./module/sort.js";

document.addEventListener('DOMContentLoaded', function () {
  // --- Логика аккордеонов фильтров ---
  accordionsFilters();

  // ---  Управление сортировкой ---
  sort();

  // --- Управление фильтрами ---
  filters();

  // --- Форма фильтров ---
  formFilters();

	// --- Мобильные фильтры: открытие/закрытие ---
	const toggleBtn = document.querySelector(".filters-toggle");
  const filtersPanel = document.querySelector(".filters-panel");

  if (!toggleBtn || !filtersPanel) return;

  // Открытие/закрытие по клику
  toggleBtn.addEventListener("click", () => {
    const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
    const newExpanded = !isExpanded;

    toggleBtn.setAttribute("aria-expanded", String(newExpanded));
    filtersPanel.classList.toggle("is-open", newExpanded);

    // Фокус на первый фильтр при открытии (доступность)
    if (newExpanded) {
      const firstFocusable = filtersPanel.querySelector(
        "button, input, select, a"
      );
      if (firstFocusable) firstFocusable.focus();
    }
  });

  // Закрытие по нажатию Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && filtersPanel.classList.contains("is-open")) {
      toggleBtn.setAttribute("aria-expanded", "false");
      filtersPanel.classList.remove("is-open");
      toggleBtn.focus(); // возврат фокуса на кнопку
    }
  });

  // Закрытие по клику вне панели (опционально)
  document.addEventListener("click", (e) => {
    if (
      filtersPanel.classList.contains("is-open") &&
      !filtersPanel.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      toggleBtn.setAttribute("aria-expanded", "false");
      filtersPanel.classList.remove("is-open");
    }
  });

  paginationProductsGrid();
});
