(() => {
  const resume = document.querySelector(".resume");
  const sidebar = resume.querySelector(".sidebar");
  const heading = document.querySelector("#name");
  const intro = document.querySelector(".intro");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const textSelector = "h1, h2, h3, p, li, a, .contact-label, .entry-meta";
  let hoveredText;

  resume.addEventListener("pointerover", event => {
    if (event.pointerType === "touch") return;

    const target = event.target instanceof Element ? event.target.closest(textSelector) : null;
    if (!target || !resume.contains(target) || target === hoveredText) return;

    hoveredText?.classList.remove("text-hover-effect", "is-hovered");
    hoveredText = target;
    hoveredText.classList.add("text-hover-effect", "is-hovered");
  });

  resume.addEventListener("pointerout", event => {
    if (!hoveredText || hoveredText.contains(event.relatedTarget)) return;

    hoveredText.classList.remove("text-hover-effect", "is-hovered");
    hoveredText = null;
  });

  if (prefersReducedMotion.matches) return;

  const entries = resume.querySelectorAll(".entry");
  entries.forEach((entry, index) => {
    entry.classList.add("entry-reveal");
    entry.style.setProperty("--entry-delay", `${(index % 3) * 140}ms`);

    const textElements = Array.from(entry.querySelectorAll("h3, .entry-meta, .role, .detail-list li"));
    const totalLetters = textElements.reduce((count, textElement) => (
      count + Array.from(textElement.textContent).filter(character => !/\s/.test(character)).length
    ), 0);
    let letterIndex = 0;

    textElements.forEach(textElement => {
      const text = textElement.textContent;
      const letters = document.createDocumentFragment();
      textElement.setAttribute("aria-label", text);

      Array.from(text).forEach((character, characterIndex) => {
        if (/\s/.test(character)) {
          letters.append(character);
          return;
        }

        const letter = document.createElement("span");
        letter.className = "entry-letter";
        letter.setAttribute("aria-hidden", "true");
        letter.textContent = character;
        const delay = totalLetters > 1 ? letterIndex * 9600 / (totalLetters - 1) : 0;
        letter.style.setProperty("--entry-letter-delay", `${delay}ms`);
        letters.append(letter);
        letterIndex += 1;
      });

      textElement.replaceChildren(letters);
    });
  });

  if ("IntersectionObserver" in window) {
    const entryObserver = new IntersectionObserver((observedEntries, observer) => {
      observedEntries.forEach(observedEntry => {
        if (!observedEntry.isIntersecting) return;

        observedEntry.target.classList.add("is-visible");
        observer.unobserve(observedEntry.target);
      });
    }, { threshold: 0.12 });

    entries.forEach(entry => entryObserver.observe(entry));
  } else {
    entries.forEach(entry => entry.classList.add("is-visible"));
  }

  const finalText = heading.textContent;
  const introWords = document.createDocumentFragment();
  intro.textContent.trim().split(/\s+/).forEach((word, index, words) => {
    const wordElement = document.createElement("span");
    wordElement.className = "intro-word";
    wordElement.setAttribute("aria-hidden", "true");
    wordElement.textContent = word;
    wordElement.style.setProperty("--word-delay", `${index * 400}ms`);
    introWords.append(wordElement);

    if (index < words.length - 1) introWords.append(" ");
  });
  intro.replaceChildren(introWords);

  const fragment = document.createDocumentFragment();
  Array.from(finalText).forEach((character, index) => {
    if (character === " ") {
      fragment.append(" ");
      return;
    }

    const letter = document.createElement("span");
    letter.setAttribute("aria-hidden", "true");
    letter.className = "name-letter";
    letter.textContent = character;
    letter.style.setProperty("--start-x", `${Math.random() * 360 - 180}px`);
    letter.style.setProperty("--start-y", `${Math.random() * 260 - 130}px`);
    letter.style.setProperty("--start-rotation", `${Math.random() * 100 - 50}deg`);
    letter.style.setProperty("--arrival-delay", `${index / finalText.length * 8800}ms`);
    fragment.append(letter);
  });

  heading.replaceChildren(fragment);
  const headingWidth = heading.getBoundingClientRect().width;
  heading.querySelectorAll(".name-letter").forEach(letter => {
    letter.style.setProperty("--name-width", `${headingWidth}px`);
    letter.style.setProperty("--letter-offset", `${heading.clientLeft - letter.offsetLeft}px`);
  });
})();
