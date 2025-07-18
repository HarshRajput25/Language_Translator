const fromText = document.querySelector(".from-text"),
      toText = document.querySelector(".to-text"),
      exchangeIcon = document.querySelector(".exchange"),
      selectTag = document.querySelectorAll("select"),
      icons = document.querySelectorAll(".row i"),
      translateBtn = document.querySelector("button");

// Populate language options
selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected = id === 0
      ? (country_code === "en-GB" ? "selected" : "")
      : (country_code === "bn-IN" ? "selected" : "");
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

// Exchange text and language
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value,
      tempLang = selectTag[0].value;
  fromText.value = toText.value;
  toText.value = tempText;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
});

// Clear translation if input is empty
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});

// Translate text using API
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim(),
      translateFrom = selectTag[0].value,
      translateTo = selectTag[1].value;
  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");
  let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      toText.value = data.responseData.translatedText;
      // Better match if available
      data.matches.forEach(match => {
        if (match.id === 0) {
          toText.value = match.translation;
        }
      });
      toText.setAttribute("placeholder", "Translation");
    })
    .catch(() => {
      toText.setAttribute("placeholder", "Translation failed");
    });
});

// Copy / Speak icons
icons.forEach(icon => {
  icon.addEventListener("click", ({ target }) => {
    if (!fromText.value && !toText.value) return;

    if (target.classList.contains("fa-copy")) {
      if (target.id === "from") {
        navigator.clipboard.writeText(fromText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else if (target.classList.contains("fa-volume-up")) {
      let utterance;
      if (target.id === "from") {
        utterance = new SpeechSynthesisUtterance(fromText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
