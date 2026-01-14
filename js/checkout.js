"use strict";
import "./app.js";
import { Tabs } from "./module/tabs.js";

document.addEventListener("DOMContentLoaded", () => {
  // Инициализируем все блоки .checkout-form
  document.querySelectorAll(".checkout-form").forEach((container) => {
    new Tabs(container);
  });

  (function () {
    // === Конфигурация ===
    const HEADER_SELECTOR = ".header"; // замени, если у хедера другой класс/селектор
    const CHECKOUT_FORMS = document.querySelectorAll(".checkout-form");
    const SUBMIT_BUTTON = document.querySelector('[data-save-button="true"]');
    const AGREEMENT_CHECKBOX = document.getElementById("user-agreement");

    if (!CHECKOUT_FORMS.length || !SUBMIT_BUTTON || !AGREEMENT_CHECKBOX) return;

    // === Состояние ===
    const checkoutData = {
      customer: null,
      delivery: null,
      paymentMethod: null,
    };

    // === Вспомогательные функции ===

    function getHeaderHeight() {
      const header = document.querySelector(HEADER_SELECTOR);
      return header ? header.offsetHeight : 0;
    }

    function scrollToElement(element, offset = 10) {
      if (!element) return;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const headerHeight = getHeaderHeight();
      window.scrollTo({
        top: elementTop - headerHeight - offset,
        behavior: "smooth",
      });
    }

    function serializeForm(form) {
      const data = {};
      const formData = new FormData(form);
      for (const [name, value] of formData.entries()) {
        data[name] = value.trim();
      }
      return data;
    }

    function validateForm(form) {
      // Сброс предыдущих ошибок
      form
        .querySelectorAll(".error")
        .forEach((el) => el.classList.add("hidden"));

      // Базовая HTML5-валидация
      if (!form.reportValidity()) {
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) {
          // Прокрутка к полю
          scrollToElement(firstInvalid);
          // Опционально: выделить поле красным — зависит от твоего CSS
        }
        return false;
      }
      return true;
    }

    function updateSubmitButtonState() {
      const isReady =
        checkoutData.customer &&
        checkoutData.delivery &&
        AGREEMENT_CHECKBOX.checked;
      SUBMIT_BUTTON.disabled = !isReady;
    }

    // === Обработчики "Далее" ===

    document.querySelectorAll(".checkout-form__btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const currentBlock = this.closest(".checkout-form");
        const tabIndex = Array.from(CHECKOUT_FORMS).indexOf(currentBlock);
        if (tabIndex === -1) return;

        // Найти активный таб и его форму
        const activeTab = currentBlock.querySelector(".tab--active");
        if (!activeTab) return;

        const tabId = activeTab.dataset.tab;
        const form = currentBlock.querySelector(
          `[data-content="${tabId}"] .checkout-form__form`
        );
        if (!form) return;

        if (!validateForm(form)) return;

        // Сохраняем данные
        const formData = serializeForm(form);
        if (tabIndex === 0) {
          checkoutData.customer = formData;
        } else if (tabIndex === 1) {
          checkoutData.delivery = formData;
        }

        // Разблокируем следующий блок
        const nextBlock = CHECKOUT_FORMS[tabIndex + 1];
        if (nextBlock) {
          nextBlock.classList.remove("no-active");
          // Скролл к заголовку следующего блока
          const title = nextBlock.querySelector(".checkout-form__title");
          scrollToElement(title, 20);
        }

        updateSubmitButtonState();
      });
    });

    // === Обработчик чекбокса ===
    AGREEMENT_CHECKBOX.addEventListener("change", updateSubmitButtonState);

    // === Обработчик отправки ===
    SUBMIT_BUTTON.addEventListener("click", function (e) {
      e.preventDefault();

      // Дополнительная проверка на случай, если disabled не сработал
      if (
        !checkoutData.customer ||
        !checkoutData.delivery ||
        !AGREEMENT_CHECKBOX?.checked
      ) {
        alert("Пожалуйста, заполните все шаги и примите соглашение.");
        return;
      }

      // Определяем способ оплаты
      const paymentBlock = CHECKOUT_FORMS[2];
      const activePaymentTab = paymentBlock.querySelector(".tab--active");
      if (!activePaymentTab) return;

      checkoutData.paymentMethod = activePaymentTab.dataset.tab;

      // Сохраняем в sessionStorage
      sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));

      // URL-карта для редиректа
      const paymentUrls = {
        sbp: "/payment/sbp.html",
        "online-payment": "/payment/card.html",
        yandex: "/payment/yandex.html",
        manager: "/payment/manager.html",
      };

      const url = paymentUrls[checkoutData.paymentMethod] || "/payment/";
      window.location.href = url;
    });

    // === Инициализация ===
    // Убедимся, что только первый блок активен
    CHECKOUT_FORMS.forEach((block, index) => {
      if (index > 0) block.classList.add("no-active");
    });

    updateSubmitButtonState();
  })();
});
