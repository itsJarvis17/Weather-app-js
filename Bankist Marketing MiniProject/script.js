"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const nav = document.querySelector(".nav");
const logo = document.querySelector(".nav__logo");
const section1 = document.querySelector("#section--1");

//////
const openModal = (e) => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = (e) => {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};
btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal();
});

// Implementing Scroll
const scrollTo = document.querySelector(".btn--scroll-to");

scrollTo.addEventListener("click", () => {
  // OLD WAY OF IMPLEMENTING SMOOTH SCROLL

  //     const xOffset = section1.getBoundingClientRect().left + window.pageXOffset;
  //   const yOffset = section1.getBoundingClientRect().top + window.pageYOffset;

  //   //   console.log(xOffset, yOffset);

  //   document.documentElement.scrollTo({
  //     left: xOffset,
  //     top: yOffset,
  //     behavior: "smooth",
  //   });

  section1.scrollIntoView({ behavior: "smooth" });
});

// Implementing scroll on nav links
document.querySelector(".nav__links").addEventListener("click", function (e) {
  //1. Add event listerner to common parent element
  //2. Determine what element originated the event

  e.preventDefault();
  //   console.log(e.target);

  //3. Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Building Tabbed Component
const tab = document.querySelectorAll(".operations__tab");
const tabContainer = document.querySelector(".operations__tab-container");
const tabContent = document.querySelectorAll(".operations__content");

tabContainer.addEventListener("click", (e) => {
  // Get target element
  const clicked = e.target.closest(".operations__tab");
  //   console.log(clicked);

  // Guard clause
  if (!clicked) return;
  //Remove active classes
  tab.forEach((t) => t.classList.remove("operations__tab--active"));
  tabContent.forEach((c) => c.classList.remove("operations__content--active"));
  // Activate tab
  clicked.classList.add("operations__tab--active");

  // Activate content
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

// Menu Fade animation
const handleMouseHover = function (e, opacity) {
  if (e.target.closest(".nav__item")) {
    const link = e.target;
    const siblings = nav.querySelectorAll(".nav__link");
    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
        logo.style.opacity = this;
      }
    });
  }
};
nav.addEventListener("mouseover", handleMouseHover.bind(0.5));

nav.addEventListener("mouseout", handleMouseHover.bind(1));

// Sticky Navigation Bar
const navHeight = nav.getBoundingClientRect().height;
const headerObsCallbackFn = (entries, headerObserver) => {
  const [entry] = entries;
  //   console.log(entry);
  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headObsOption = {
  root: null,
  threshold: [0],
  rootMargin: `${navHeight}px`,
};

const header = document.querySelector(".header__title");
const headerObserver = new IntersectionObserver(
  headerObsCallbackFn,
  headObsOption
);
headerObserver.observe(header);

//Revealing Elements on Scroll
const revelSection = (entries, section) => {
  entries.forEach((entry) => {
    //   console.log(entry, section);
    if (!entry.isIntersecting) return;
    entry.target.classList.remove("section--hidden");
    sectionObserver.unobserve(entry.target);
  });
};
const allSections = document.querySelectorAll(".section");
const sectionObserver = new IntersectionObserver(revelSection, {
  root: null,
  threshold: [0.15],
});
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Lazy loading Images
const loadImage = (entries, img) => {
  //   console.log(entries);
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener("load", () => {
      entry.target.classList.remove("lazy-img");
      imgObserver.unobserve(entry.target);
    });
  });
};
const imgTargets = document.querySelectorAll("img[data-src]");
const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 1,
});

imgTargets.forEach((img) => imgObserver.observe(img));

// Implementing Testimonials Slider
const sliderFn = () => {
  const slides = document.querySelectorAll(".slide");
  const btnRight = document.querySelector(".slider__btn--right");
  const btnLeft = document.querySelector(".slider__btn--left");
  const maxSlide = slides.length;
  let currSlide = 0;

  //Goto slide function
  const goToSlide = (slide) => {
    slides.forEach(
      (sl, i) => (sl.style.transform = `translateX(${100 * (slide - i)}%)`)
    );
  };

  // Next slide
  const nextSlide = () => {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      ++currSlide;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };
  btnRight.addEventListener("click", nextSlide);

  // Previous Slide
  const prevSlide = () => {
    if (currSlide === 0) {
      currSlide = maxSlide - 1;
    } else {
      --currSlide;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };
  btnLeft.addEventListener("click", prevSlide);

  // Activate Dots as slide changes
  const dotContainer = document.querySelector(".dots");

  //Create Dots
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = (slide) => {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  // Init dots and first slide
  (function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  })();
  document.addEventListener("keydown", (e) => {
    // console.log(e.key);
    if (e.key === "ArrowRight") nextSlide();
    else if (e.key === "ArrowLeft") prevSlide();
  });

  dotContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("dots__dot")) {
      currSlide = Number(e.target.dataset.slide);
      goToSlide(currSlide);
      activateDot(currSlide);
    }
  });
};
sliderFn();
