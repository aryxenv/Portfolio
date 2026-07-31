/**
 * Reserve each project card's opened height.
 *
 * On desktop the description is collapsed to `max-height: 0` and opens on
 * contact. Every card sits in an `fr` grid track, and `fr` tracks size their
 * minimum from content, so without a reservation the row would grow the moment
 * a card opened and the whole section would jump.
 *
 * CSS cannot measure wrapped text, so the height is read once per layout:
 * `data-measuring` briefly releases every card from its track, all of them are
 * read in one synchronous pass, and the attribute is dropped before the frame
 * paints. The SPA did the same job with three `scrollHeight` reads, two
 * hardcoded pixel constants and one debounced resize listener per card.
 */

const DESKTOP = "(min-width: 1181px)";
const RESIZE_DELAY = 200;

let bound = false;

function cards() {
  return [...document.querySelectorAll<HTMLElement>(".project-card")];
}

function reserve() {
  const all = cards();
  if (all.length === 0) return;

  if (!window.matchMedia(DESKTOP).matches) {
    for (const card of all) card.style.minHeight = "";
    return;
  }

  for (const card of all) {
    card.style.minHeight = "";
    card.setAttribute("data-measuring", "");
  }

  // batched: the first read lays out the whole set, the rest are free
  const heights = all.map((card) => card.offsetHeight);

  for (const card of all) card.removeAttribute("data-measuring");
  all.forEach((card, i) => {
    card.style.minHeight = `${heights[i]}px`;
  });
}

export function initProjectCards() {
  reserve();

  // metrics change once the variable font swaps in
  document.fonts?.ready.then(reserve);

  if (bound) return;
  bound = true;

  let timer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    clearTimeout(timer);
    timer = setTimeout(reserve, RESIZE_DELAY);
  });
  window.matchMedia(DESKTOP).addEventListener("change", reserve);
}
