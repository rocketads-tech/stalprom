import './app.js';
import Swiper from 'swiper/bundle';
import heroSlider from './module/hero-slider.js';
import sectionSlider from "./module/section-slider.js";
import categoriesSlider from "./module/categories-slider.js";


document.addEventListener('DOMContentLoaded', function () {
  const body = document.querySelector("body");

  // --- Инициализация Swiper слайдера для hero-секции---
  heroSlider(Swiper);

  // --- Инициализация Swiper слайдера для section-slider-секции ---
  sectionSlider(Swiper, document.querySelector(".section-slider"));

  // --- Инициализация Swiper слайдера для categories-секции ---
  categoriesSlider(Swiper);

});