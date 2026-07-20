/* =============================================================
   Real estate concierge overlay — lead-capture intent renders a
   call/text CTA. Also listens for `destura:chat-open` events so
   page CTAs (the valuation band) can open the overlay with a
   question pre-sent — form-free lead capture through conversation.
   ============================================================= */
(function () {
  "use strict";

  const trigger = document.getElementById("chat-trigger");
  const overlay = document.getElementById("chat-overlay");
  if (!trigger || !overlay) return;

  const closeBtn = document.getElementById("chat-close");
  const thread = document.getElementById("chat-thread");
  const suggestions = document.getElementById("chat-suggestions");
  const form = document.getElementById("chat-form");
  const field = document.getElementById("chat-field");

  const PHONE_HREF = window.__DESTURA_PHONE_HREF__ || "";
  const PHONE = window.__DESTURA_PHONE__ || "";
  const BOOKING_URL = window.__DESTURA_BOOKING_URL__ || "";
  const ENDPOINT = "/api/chat";
  const MARKER = "[[BOOK_CTA]]";

  let history = [];
  let sending = false;
  let lastFocused = null;

  function isOpen() { return overlay.classList.contains("is-open"); }

  function getFocusable() {
    return Array.prototype.slice
      .call(overlay.querySelectorAll('button, textarea, [href], input, [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
  }

  function onKeydown(e) {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "Tab") {
      const focusable = getFocusable();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function open() {
    lastFocused = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    trigger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    field.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    trigger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    else trigger.focus();
  }

  trigger.addEventListener("click", function () { isOpen() ? close() : open(); });
  if (closeBtn) closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });

  // Page CTAs (e.g. the valuation band) open the overlay with a
  // question pre-sent, so the conversation starts already moving.
  document.addEventListener("destura:chat-open", function (e) {
    if (!isOpen()) open();
    const prompt = e.detail && e.detail.prompt;
    if (prompt) send(prompt);
  });

  function addTurn(role, text) {
    const row = document.createElement("div");
    row.className = "chat-turn chat-turn--" + role;
    const p = document.createElement("p");
    p.textContent = text;
    row.appendChild(p);
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
    return row;
  }

  function addCallCta() {
    const wrap = document.createElement("div");
    wrap.className = "chat-cta";
    if (BOOKING_URL) {
      const book = document.createElement("a");
      book.href = BOOKING_URL;
      book.target = "_blank";
      book.rel = "noopener";
      book.className = "btn btn--book";
      book.textContent = "Book Online";
      wrap.appendChild(book);
    }
    const a = document.createElement("a");
    a.href = "tel:" + PHONE_HREF;
    a.className = "btn btn--ghost btn--on-dark";
    a.textContent = "Call " + PHONE;
    wrap.appendChild(a);
    thread.appendChild(wrap);
    thread.scrollTop = thread.scrollHeight;
  }

  function showThinking() {
    const row = document.createElement("div");
    row.className = "chat-turn chat-turn--assistant chat-turn--thinking";
    row.innerHTML = '<span class="chat-dots"><span></span><span></span><span></span></span>';
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
    return row;
  }

  function visiblePortion(fullText) {
    for (let i = Math.min(MARKER.length - 1, fullText.length); i > 0; i--) {
      if (fullText.slice(-i) === MARKER.slice(0, i)) return fullText.slice(0, -i);
    }
    return fullText;
  }

  async function send(text) {
    if (sending || !text.trim()) return;
    sending = true;
    if (suggestions) suggestions.remove();

    addTurn("user", text);
    history.push({ role: "user", content: text });

    const thinking = showThinking();
    let assistantText = "";
    let assistantRow = null;

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) throw new Error("bad response");

      thinking.remove();
      assistantRow = addTurn("assistant", "");
      const p = assistantRow.querySelector("p");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        p.textContent = visiblePortion(assistantText);
        thread.scrollTop = thread.scrollHeight;
      }
    } catch (err) {
      thinking.remove();
      if (!assistantRow) assistantRow = addTurn("assistant", "");
      assistantRow.querySelector("p").textContent =
        "Something went wrong on my end — please call us directly instead.";
      addCallCta();
      sending = false;
      return;
    }

    const hasCta = assistantText.indexOf(MARKER) !== -1;
    const clean = assistantText.split(MARKER).join("").trim();
    assistantRow.querySelector("p").textContent = clean;
    history.push({ role: "assistant", content: clean });
    if (hasCta) addCallCta();

    sending = false;
    field.focus();
  }

  if (suggestions) {
    suggestions.querySelectorAll(".chat-chip").forEach(function (chip) {
      chip.addEventListener("click", function () { send(chip.textContent); });
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = field.value;
    field.value = "";
    field.style.height = "auto";
    send(text);
  });

  field.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  field.addEventListener("input", function () {
    field.style.height = "auto";
    field.style.height = Math.min(field.scrollHeight, 160) + "px";
  });
})();
