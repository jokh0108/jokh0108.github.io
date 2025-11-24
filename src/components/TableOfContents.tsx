import { createEffect, createSignal, For, Show } from "solid-js";

interface Heading {
  text: string;
  id: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = createSignal<Heading[]>([]);
  const [activeId, setActiveId] = createSignal<string>("");

  createEffect(() => {
    // Extract headings from the page
    const article = document.querySelector("article");
    if (!article) return;

    const headingElements = article.querySelectorAll("h2, h3, h4");
    const extractedHeadings: Heading[] = Array.from(headingElements)
      .map((el, index) => {
        const id = el.id || `heading-${index}`;
        if (!el.id) el.id = id;

        return {
          text: el.textContent || "",
          id,
          level: parseInt(el.tagName[1]),
        };
      })
      .filter((h) => h.text.trim().length > 0);

    setHeadings(extractedHeadings);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  });

  const getPaddingClass = (level: number) => {
    switch (level) {
      case 2:
        return "pl-0";
      case 3:
        return "pl-4";
      case 4:
        return "pl-8";
      default:
        return "pl-0";
    }
  };

  return (
    <Show when={headings().length > 0}>
      <nav class="toc">
        <div class="text-sm font-semibold mb-4 uppercase">목차</div>
        <ul class="space-y-2">
          <For each={headings()}>
            {(heading) => (
              <li class={getPaddingClass(heading.level)}>
                <a
                  href={`#${heading.id}`}
                  class={`text-sm transition-colors duration-200 block py-1 ${
                    activeId() === heading.id
                      ? "text-black dark:text-white font-semibold"
                      : "text-black/60 dark:text-white/60 hover:text-black hover:dark:text-white"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </Show>
  );
}
