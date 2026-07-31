/**
 * Technologies category switcher.
 *
 * Every category's chips are server-rendered; this only moves the `.slide`
 * class around and drives the dropdown. Keeping it out of React means the
 * whole tech stack is in the static HTML rather than behind a hydration.
 */
export function initTechSwitcher(): void {
  const container = document.querySelector<HTMLElement>(
    ".technologies-list-container",
  );
  if (!container) return;

  const title = container.querySelector<HTMLElement>(
    ".technologies-list-title",
  );
  const toggle = container.querySelector<HTMLButtonElement>(
    ".technologies-list-toggle",
  );
  const label = container.querySelector<HTMLElement>(
    ".technologies-list-label",
  );
  const options = [
    ...container.querySelectorAll<HTMLButtonElement>(
      ".technologies-category-option",
    ),
  ];
  const slides = [
    ...container.querySelectorAll<HTMLElement>("[data-category]"),
  ];
  if (!title || !toggle || !label || !slides.length) return;

  let current = 0;

  const closeMenu = () => {
    title.removeAttribute("data-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const select = (next: number) => {
    current = (next + slides.length) % slides.length;

    slides.forEach((slide, i) =>
      slide.classList.toggle("slide", i !== current),
    );
    options.forEach((option, i) =>
      option.classList.toggle("active", i === current),
    );
    label.textContent = options[current]?.textContent ?? "";

    closeMenu();
  };

  toggle.addEventListener("click", () => {
    const open = title.toggleAttribute("data-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  options.forEach((option, index) =>
    option.addEventListener("click", () => select(index)),
  );

  container
    .querySelector(".prev")
    ?.addEventListener("click", () => select(current - 1));
  container
    .querySelector(".next")
    ?.addEventListener("click", () => select(current + 1));

  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (target instanceof Node && title.contains(target)) return;
    closeMenu();
  });
  window.addEventListener("scroll", closeMenu, true);
}
