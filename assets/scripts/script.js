// ---------- Utility ----------
function $(sel, root = document) {
  return root.querySelector(sel);
}
function $id(id) {
  return document.getElementById(id);
}
function safeSetHTML(id, html) {
  const el = $id(id);
  if (el) el.innerHTML = html;
}

// ---------- Run after DOM is ready ----------
document.addEventListener("DOMContentLoaded", () => {
  // ---- Table of Contents (safe) ----
  const tocList = $id("toc-list");
  const headings = document.querySelectorAll(".section-title, .subsection-title");

  if (tocList && headings.length) {
    headings.forEach((heading) => {
      const id = heading.textContent.trim().replace(/\s+/g, "-").toLowerCase();
      heading.id = id;

      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = heading.textContent;
      a.href = `#${id}`;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: "smooth" });
      });

      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  // ---- Back-to-top button (supports id OR class) ----
  const backToTopBtn = $("#backToTopBtn") || $(".back-to-top");

  if (backToTopBtn) {
    // start hidden if desired
    if (!backToTopBtn.style.display) backToTopBtn.style.display = "none";

    const onScroll = () => {
      const scrolled =
        document.documentElement.scrollTop || document.body.scrollTop;
      backToTopBtn.style.display = scrolled > 600 ? "block" : "none";
      // optional opacity tweak if your CSS uses it
      if (scrolled > 200) backToTopBtn.style.opacity = "1";
      else backToTopBtn.style.opacity = "0.2";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    onScroll(); // initialize state
  }

  // ---- Contact bits (only on pages that have targets) ----
  // Email
  const emailTarget = $id("email");
  if (emailTarget) {
    const part1 = "raindust";
    const part2 = "@myyahoo.com";
    const email = part1 + part2;
    emailTarget.innerHTML = `<a href="mailto:${email}">${email}</a>`;
  }

  // X / Twitter link
  const xLinkTarget = $id("x-link");
  if (xLinkTarget) {
    const xProfileUrl = "https://x.com/az_rain_dust";
    xLinkTarget.innerHTML = `<a href="${xProfileUrl}" target="_blank" rel="noopener noreferrer">Message me on X (formerly known as Twitter)</a>`;
  }
});
