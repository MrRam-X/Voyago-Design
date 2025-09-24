document.addEventListener("DOMContentLoaded", function () {
  // --- Mobile Menu Drawer Logic ---
  const openMenuButton = document.getElementById("open-menu-button");
  const closeMenuButton = document.getElementById("close-menu-button");
  const sideDrawer = document.getElementById("side-drawer");
  const menuOverlay = document.getElementById("menu-overlay");

  const openMenu = () => {
    sideDrawer.classList.remove("-translate-x-full");
    menuOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    sideDrawer.classList.add("-translate-x-full");
    menuOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  };

  openMenuButton.addEventListener("click", openMenu);
  closeMenuButton.addEventListener("click", closeMenu);
  menuOverlay.addEventListener("click", closeMenu);

  // --- Hero Section Image Slideshow ---
  const heroBg = document.getElementById("hero-bg");
  const images = [
    "./assets/images/hero-section-image.jpg",
    "./assets/images/boat-in-a-lake.jpg",
    "./assets/images/hot-air-balooning.jpg",
  ];
  let currentImageIndex = 0;
  heroBg.style.backgroundImage = `url('${images[0]}')`;
  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    heroBg.style.backgroundImage = `url('${images[currentImageIndex]}')`;
  }, 5000);

  // --- NEW: Custom Dropdown Logic ---
  const customSelects = document.querySelectorAll(".custom-select-wrapper");
  customSelects.forEach((select) => {
    const trigger = select.querySelector(".custom-select-trigger");
    const options = select.querySelector(".custom-select-options");
    const optionItems = options.querySelectorAll("li");
    const hiddenInput = trigger.querySelector('input[type="hidden"]');
    const displaySpan = trigger.querySelector("span");

    trigger.addEventListener("click", () => {
      options.classList.toggle("hidden");
    });

    optionItems.forEach((option) => {
      option.addEventListener("click", () => {
        displaySpan.textContent = option.textContent;
        hiddenInput.value = option.dataset.value;
        options.classList.add("hidden");
      });
    });
  });

  // Close dropdowns when clicking outside
  window.addEventListener("click", function (e) {
    customSelects.forEach((select) => {
      if (!select.contains(e.target)) {
        select.querySelector(".custom-select-options").classList.add("hidden");
      }
    });
  });

  // --- NEW: Guests Input Logic ---
  const guestsInput = document.getElementById("guests-input");
  const incrementBtn = document.getElementById("increment-guests");
  const decrementBtn = document.getElementById("decrement-guests");

  incrementBtn.addEventListener("click", (e) => {
    e.preventDefault();
    guestsInput.value = parseInt(guestsInput.value, 10) + 1;
  });

  decrementBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const currentValue = parseInt(guestsInput.value, 10);
    if (currentValue > 1) {
      // Prevent going below 1
      guestsInput.value = currentValue - 1;
    }
  });

  // --- NEW: Custom Date Range Picker Logic ---
  const datePickerTrigger = document.getElementById("date-picker-trigger");
  const datePickerContainer = document.getElementById("date-picker-container");
  const calendarsContainer = document.getElementById("calendars-container");
  const dateDisplay = document.getElementById("date-display");
  const dateRangeDisplay = document.getElementById("date-range-display");
  const cancelBtn = document.getElementById("cancel-date-btn");
  const applyBtn = document.getElementById("apply-date-btn");

  let currentMonthDate = new Date();
  currentMonthDate.setDate(1); // Set to the first day of the month
  let startDate = null;
  let endDate = null;

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  function formatDate(date) {
    if (!date) return "";
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const y = date.getFullYear();
    return `${m}/${d}/${y}`;
  }

  function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let html = `
                <div class="w-full px-2">
                    <div class="flex justify-between items-center mb-2">
                        ${
                          calendarsContainer.children.length === 0
                            ? `<button class="prev-month">&lt;</button>`
                            : "<div></div>"
                        }
                        <div class="font-bold">${
                          monthNames[month]
                        } ${year}</div>
                        ${
                          calendarsContainer.children.length === 1
                            ? `<button class="next-month">&gt;</button>`
                            : "<div></div>"
                        }
                    </div>
                    <div class="grid grid-cols-7 text-center text-sm text-gray-500">
                        <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                    </div>
                    <div class="grid grid-cols-7 text-center text-sm mt-2">
            `;

    for (let i = 0; i < firstDay; i++) {
      html += `<div></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      let classes = "calendar-day p-1 cursor-pointer rounded-full";
      if (dayDate.toDateString() === today.toDateString()) classes += " today";
      if (startDate && dayDate.toDateString() === startDate.toDateString())
        classes += " selected-start";
      if (endDate && dayDate.toDateString() === endDate.toDateString())
        classes += " selected-end";
      if (startDate && endDate && dayDate > startDate && dayDate < endDate)
        classes += " in-range";

      html += `<div class="${classes}" data-date="${dayDate.toISOString()}">${i}</div>`;
    }
    html += `</div></div>`;
    return html;
  }

  function renderDualCalendars() {
    calendarsContainer.innerHTML = "";
    const nextMonthDate = new Date(currentMonthDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

    calendarsContainer.innerHTML += renderCalendar(currentMonthDate);
    calendarsContainer.innerHTML += renderCalendar(nextMonthDate);

    // Re-add event listeners
    document.querySelector(".prev-month")?.addEventListener("click", () => {
      currentMonthDate.setMonth(currentMonthDate.getMonth() - 1);
      renderDualCalendars();
    });
    document.querySelector(".next-month")?.addEventListener("click", () => {
      currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);
      renderDualCalendars();
    });
    document.querySelectorAll(".calendar-day").forEach((day) => {
      day.addEventListener("click", handleDateClick);
    });
  }

  function handleDateClick(e) {
    const selectedDate = new Date(e.target.dataset.date);
    if (!startDate || (startDate && endDate)) {
      startDate = selectedDate;
      endDate = null;
    } else if (selectedDate < startDate) {
      startDate = selectedDate;
    } else {
      endDate = selectedDate;
    }
    updateDateDisplays();
    renderDualCalendars();
  }

  function updateDateDisplays() {
    if (startDate && endDate) {
      dateRangeDisplay.textContent = `${formatDate(startDate)} - ${formatDate(
        endDate
      )}`;
    } else if (startDate) {
      dateRangeDisplay.textContent = `${formatDate(startDate)} - ...`;
    } else {
      dateRangeDisplay.textContent = "";
    }
  }

  function openDatePicker() {
    renderDualCalendars();
    datePickerContainer.classList.remove("hidden");
    setTimeout(() => {
      datePickerContainer.classList.remove("opacity-0", "scale-95");

      // Positioning logic
      const triggerRect = datePickerTrigger.getBoundingClientRect();
      const containerRect = datePickerContainer.getBoundingClientRect();
      if (triggerRect.bottom + containerRect.height > window.innerHeight) {
        datePickerContainer.classList.add("top");
      } else {
        datePickerContainer.classList.remove("top");
      }
    }, 10);
  }

  function closeDatePicker() {
    datePickerContainer.classList.add("opacity-0", "scale-95");
    setTimeout(() => datePickerContainer.classList.add("hidden"), 200);
  }

  datePickerTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (datePickerContainer.classList.contains("hidden")) {
      openDatePicker();
    } else {
      closeDatePicker();
    }
  });

  applyBtn.addEventListener("click", () => {
    if (startDate && endDate) {
      dateDisplay.textContent = `${formatDate(startDate)} - ${formatDate(
        endDate
      )}`;
    } else if (startDate) {
      dateDisplay.textContent = formatDate(startDate);
    }
    closeDatePicker();
  });

  cancelBtn.addEventListener("click", closeDatePicker);
  // --- Close popups when clicking outside ---
  window.addEventListener("click", function (e) {
    // Close date picker
    if (!datePickerTrigger.contains(e.target)) {
      closeDatePicker();
    }
    // Close custom selects (existing logic)
  });
});
