(() => {
  "use strict";

  const root = document.documentElement;
  const store = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* storage can be unavailable; the page still works */
      }
    },
  };

  /* ---------------- i18n ---------------- */
  const tr = {
    skip: "İçeriğe geç",
    "nav.features": "Özellikler",
    "nav.tour": "Tur",
    "nav.design": "Tasarım",
    "nav.platforms": "Platformlar",
    "nav.docs": "Belgeler",
    "nav.demo": "Tarayıcıda dene",

    "hero.eyebrow": "Bir yaratıcı yol arkadaşı",
    "hero.title": 'Fikirlerine biraz daha <span class="grad">ışık</span> ver.',
    "hero.lead":
      "Yenilume, ürettiğin şeyi okur — bir şarkı sözü, bir paragraf, bir fotoğraf — ve sana bir ruh hali, bir palet, bir açıklama ve onu paylaşmak için nazik bir plan verir. Hepsi kendi cihazında.",
    "hero.primary": "Web uygulamasını aç",
    "hero.secondary": "Kısa bir tura çık",
    "hero.meta1": "Windows · Android · iOS",
    "hero.meta2": "Yerel çalışır, hesap istemez",
    "hero.bubbleMood": "Rüya gibi · umutlu",
    "hero.bubbleMoodSub": "sözlerinden okunan ruh hali",
    "hero.bubblePalette": "görselinden gelen palet",

    "stats.1": "cihaz içi analiz",
    "stats.2": "hesap gerekmez",
    "stats.3": "platform, tek tasarım",
    "stats.4": "dil: EN & TR",

    "features.eyebrow": "Küçük stüdyo, büyük hayal gücü",
    "features.title": "Bir fikirden <em>paylaşılabilir</em> bir işe giden her şey.",
    "features.lead":
      "Ayarlanacak panel yok, prompt mühendisliği yok. Sadece fikrini bırakacağın sıcak bir yer ve etrafında birkaç düşünceli araç.",

    "f1.tag": "Stüdyo",
    "f1.title": "Her fikir için tek, sakin bir tuval",
    "f1.body":
      "Yaz, yapıştır ya da bir görsel bırak. Yenilume ruh halini tahmin eder, fotoğrafından bir palet çıkarır, yönler önerir — nedenini de sade bir dille anlatır.",
    "f2.tag": "Paylaşım planı",
    "f2.title": "İşe uygun bir plan",
    "f2.body":
      "TikTok, Instagram, YouTube, Pinterest, X veya LinkedIn'i ve kaç günün olduğunu seç. Her biri için kısa bir gerekçeyle zaman önerileri al, yaptıkça işaretle.",
    "f3.tag": "Yaratıcı destek",
    "f3.title": "Gece üç fikirlerine arkadaş",
    "f3.body":
      "Asistandan küçük bir dürtme iste, fikir destesinden bir kıvılcım çek ya da moral veren bir cümle al. İnternet kapalıyken de çalışır.",
    "f4.tag": "Kütüphane",
    "f4.title": "Ürettiğin her şey saklı",
    "f4.body":
      "Ara, taslakları planlananlardan ayır, bir işi tek dokunuşla yeniden aç ve yedeklemek istediğinde tek bir JSON dosyası olarak dışa aktar.",
    "f5.tag": "Temalar",
    "f5.title": "Altı pastel ruh hali, açık ve koyu",
    "f5.body":
      "Lavanta, Bulut, Nane, Muz, Baklava ve Allık — her biri özenle kurulmuş koyu sürümü, bol kontrast ve hareket azaltma desteğiyle.",
    "f6.tag": "İki dilli",
    "f6.title": "Türkçe ve İngilizce, cihazında",
    "f6.body":
      "Her etiket, ipucu, gerekçe ve açıklama çevrildi. Hiçbir şey cihazdan çıkmaz; isteğe bağlı dış modeller kapalı gelir ve README'de anlatılır.",

    "tour.eyebrow": "Kısa bir tur",
    "tour.title": "Üç adım, boş sayfa yok.",
    "tour1.tag": "01 · Bırak",
    "tour1.title": "Her tür fikir için tek tuval.",
    "tour1.body":
      "Şarkı sözü, bir paragraf ya da bir eskiz fotoğrafı yapıştır. Yenilume cihazında okur, hissi bulur ve gerçekten kullanabileceğin yönler önerir — gerekçesi görünür, saklı değil.",
    "tour1.t1": "Ruh hali ve tema tespiti",
    "tour1.t2": "Görselinden çıkarılan palet",
    "tour1.t3": "Açıklama, etiket ve paylaşım zamanı",
    "tour2.tag": "02 · Şekillendir",
    "tour2.title": "Enerjine saygı duyan bir plan.",
    "tour2.body":
      "Nerede paylaşmak istediğini ve kaç güne yayacağını seç. Plan yumuşak bir takvime düşer; her zaman diliminin bir gerekçesi olduğu için hiçbir şey keyfî hissettirmez.",
    "tour2.t1": "Platforma uygun öneriler",
    "tour2.t2": "Seri baskısı olmayan nazik hatırlatmalar",
    "tour2.t3": "Doğrudan uygulamadan paylaş",
    "tour3.tag": "03 · Devam et",
    "tour3.title": "Promptu hiç bitmeyen bir yol arkadaşı.",
    "tour3.body":
      "İlk dizeyi, bir başlığı, renk hikâyesini ya da devam etme sebebini sor. Asistan, fikir destesi ve kütüphanen aynı sakin yerde.",
    "tour3.t1": "Yönlendirilmiş yaratıcı egzersizler",
    "tour3.t2": "Tıkandığında fikir kıvılcımları",
    "tour3.t3": "Geçmiş işleri ara ve yeniden aç",

    "design.eyebrow": "Tasarım sistemi",
    "design.title": "Üstte rüya gibi. Altta pratik.",
    "design.lead":
      "Renkler, köşe yumuşaklıkları ve yazı tipleri uygulamalarla aynı belirteçlerden geliyor; böylece bu sayfa, Windows uygulaması ve mobil uygulamalar tek bir küçük dünya gibi hissettiriyor.",
    "design.paletteTitle": "Altı pastel ruh hali",
    "design.paletteNote": "Bir ruh haline dokun — tüm sayfa ona göre ısınsın.",
    "design.typeTitle": "Yuvarlak başlıklar, arkadaş canlısı gövde",
    "design.typeNote": "El yapımı hissettirmesi gereken anlar için Baloo 2, uzun okumalar için Nunito. İkisi de pakete dahil.",
    "design.tokensTitle": "Yumuşak kenarlardan yapıldı",
    "design.token1": "kart köşe yarıçapı",
    "design.token2": "yumuşak gölge",
    "design.token3": "ince kenarlık",
    "design.token4": "hap düğmeler",
    "design.darkTitle": "Kendi ışığı olan bir koyu tema",
    "design.darkNote":
      "Ters çevrilmiş değil: erik tonunda yüzeyler, lavanta vurgular ve geç saatlerde okunabilen sakin bir kontrast.",

    "c.lavender": "Lavanta",
    "c.cloud": "Bulut",
    "c.mint": "Nane",
    "c.banana": "Muz",
    "c.baklava": "Baklava",
    "c.blush": "Allık",

    "platforms.eyebrow": "Tek ekosistem",
    "platforms.title": "Windows, Android ve iOS. Aynı küçük dünya.",
    "platforms.lead":
      "Ortak bir React + TypeScript kod tabanı; Windows için Electron, mobil için Capacitor ile sarılıyor. Analiz motoru Lumen Core saf TypeScript olduğu için her yerde, çevrimdışı çalışıyor.",
    "p.win.tag": "Masaüstü",
    "p.win.title": "Windows için Yenilume",
    "p.win.body":
      "Çerçevesiz, yuvarlak hatlı bir pencere; yerel menüler ve güvenli uygulama protokolü. Kurulum ve taşınabilir sürüm dahil.",
    "p.win.download": "Windows kurulum dosyasını indir",
    "p.android.tag": "Android",
    "p.android.title": "Android'de Yenilume",
    "p.android.body":
      "Alt gezinme, yerel paylaşım ve nazik dokunsal geri bildirim içeren bir Capacitor kabuğu; tek elle kullanım için ayarlandı.",
    "p.ios.tag": "iOS",
    "p.ios.title": "iPhone ve iPad'de Yenilume",
    "p.ios.body":
      "iOS için aynı kabuk; güvenli alanlara duyarlı yerleşim ve kolay erişilen kontroller. İmzalamak ve çalıştırmak için macOS'ta Xcode'da açın.",
    "platforms.mobileTitle": "Küçük ekranlar sıkıştırılmış değil, kendi yerleşimine sahip.",
    "platforms.mobileBody":
      "Aynı bileşenler başparmağa dost bir kabuğa dönüşüyor: alt dock, daha büyük dokunma alanları ve listeye katlanan bir takvim. Tek tasarım sistemi, üç yerel his.",
    "platforms.note":
      "Tarayıcı önizlemesi aynı arayüz. Derlemeler şimdilik yerel olarak üretiliyor — henüz mağaza kaydı yok.",

    "privacy.eyebrow": "Tasarımı gereği yerel",
    "privacy.title": "Fikirlerin sende kalır.",
    "privacy.body":
      "Sözler ve görseller uygulamanın içinde, Lumen Core tarafından analiz edilir — küçük, belirlenimci ve açıklanabilir. Hesap yok, yükleme yok, analitik yok. İsteğe bağlı dış modeller Ayarlar'dan bağlanabilir ve varsayılan olarak kapalıdır.",
    "privacy.p1": "Varsayılan olarak hiçbir şey cihazdan çıkmaz",
    "privacy.p2": "Tek JSON dosyası her şeyi dışa aktarır",
    "privacy.p3": "Uçak modunda da çalışır",

    "cta.eyebrow": "Sen hazır olduğunda",
    "cta.title": "Bir şey üretmeye hazır mısın?",
    "cta.body":
      "Tarayıcıda başla ya da masaüstü ve mobil uygulamaları kaynaktan derle. İlk fikrin zaten bekliyor.",
    "cta.primary": "Web uygulamasını aç",
    "cta.secondary": "README'yi oku",
    "cta.source": "Kaynak kodu",
    "cta.license": "Lisans",
    "cta.download": "Windows kurulumu",

    credits:
      'Konsept ve yaratıcı yönetim: <strong>Sema Nur Biçki</strong> (smnrbck) · Yaratıcı destek: <a href="https://xiondigital.net" target="_blank" rel="noreferrer">xiondigital</a>',

    "footer.tag": "Yaratıcı olasılıklara açılan küçük bir pencere.",
    "footer.product": "Ürün",
    "footer.web": "Web uygulaması",
    "footer.windows": "Windows",
    "footer.android": "Android",
    "footer.ios": "iOS",
    "footer.project": "Proje",
    "footer.license": "Lisans",
    "footer.elsewhere": "Bağlantılar",
    "footer.build": "Özenle ve biraz ışıltıyla yapıldı.",

    "alt.hero": "Yenilume'un paylaşım planı ekranı: pastel platform kartları ve önerilen takvim",
    "alt.studio": "Yenilume stüdyosu: metin fikri, tespit edilen ruh hali ve oluşturulan analiz",
    "alt.plan": "Paylaşım planı takvimi: pastel platform kartları ve planlanan fikirler",
    "alt.assistant": "Yenilume asistanı: sevimli maskot, önerilen istemler ve bir yanıt",
    "alt.dark": "Koyu temada Yenilume stüdyosu: erik arka plan ve lavanta vurgular",
    "alt.phone": "Yenilume telefonda: alt gezinme ve kompakt takvim",
  };

  const copy = {
    en: {
      title: "Yenilume — a little window into creative possibilities",
      description:
        "Yenilume is a calm, local-first creative companion for musicians, writers, designers and makers. Find the mood, the palette and a gentle plan — on Windows, Android and iOS.",
    },
    tr: {
      title: "Yenilume — yaratıcı olasılıklara açılan küçük bir pencere",
      description:
        "Yenilume; müzisyenler, yazarlar, tasarımcılar ve üreticiler için sakin, yerel çalışan bir yaratıcı yol arkadaşı. Ruh halini, paleti ve nazik bir planı bul — Windows, Android ve iOS'ta.",
    },
  };

  const textNodes = [...document.querySelectorAll("[data-i18n]")];
  const originalText = new Map(textNodes.map((node) => [node.dataset.i18n, node.innerHTML]));
  const altNodes = [...document.querySelectorAll("[data-i18n-alt]")];
  const originalAlt = new Map(altNodes.map((node) => [node.dataset.i18nAlt, node.getAttribute("alt")]));
  const shotNodes = [...document.querySelectorAll("img[data-shot]")];
  const desc = document.querySelector('meta[name="description"]');
  const langToggle = document.getElementById("langToggle");

  function applyLanguage(lang) {
    const isTr = lang === "tr";
    textNodes.forEach((node) => {
      const key = node.dataset.i18n;
      node.innerHTML = (isTr && tr[key]) || originalText.get(key) || "";
    });
    altNodes.forEach((node) => {
      const key = node.dataset.i18nAlt;
      node.setAttribute("alt", (isTr && tr[key]) || originalAlt.get(key) || "");
    });
    /* the Turkish tour shows the app itself running in Turkish */
    shotNodes.forEach((node) => {
      node.src = isTr ? `screenshots/tr/${node.dataset.shot}.png` : `screenshots/${node.dataset.shot}.png`;
    });
    document.documentElement.lang = lang;
    document.title = copy[lang].title;
    if (desc) desc.setAttribute("content", copy[lang].description);
    if (langToggle) {
      langToggle.textContent = isTr ? "EN" : "TR";
      langToggle.setAttribute("aria-label", isTr ? "Switch language to English" : "Switch language to Turkish");
    }
    store.set("yenilume.site.lang", lang);
  }

  const savedLang = store.get("yenilume.site.lang");
  const initialLang = savedLang === "tr" || savedLang === "en" ? savedLang : navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en";
  if (initialLang === "tr") applyLanguage("tr");

  langToggle?.addEventListener("click", () => {
    applyLanguage(root.lang === "tr" ? "en" : "tr");
  });

  /* ---------------- accent moods ---------------- */
  const accents = ["lavender", "cloud", "mint", "banana", "baklava", "blush"];
  const swatches = [...document.querySelectorAll("[data-accent]")];

  function applyAccent(name, persist = true) {
    const accent = accents.includes(name) ? name : "lavender";
    root.dataset.theme = accent;
    swatches.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.accent === accent));
    });
    if (persist) store.set("yenilume.site.accent", accent);
  }

  const savedAccent = store.get("yenilume.site.accent");
  applyAccent(savedAccent, false);
  swatches.forEach((button) => {
    button.addEventListener("click", () => applyAccent(button.dataset.accent));
  });

  /* ---------------- light / dark ---------------- */
  const modeToggle = document.getElementById("modeToggle");
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  function applyMode(mode, persist = true) {
    const dark = mode === "dark";
    root.dataset.mode = dark ? "dark" : "light";
    modeToggle?.setAttribute("aria-pressed", String(dark));
    modeToggle?.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    if (themeMeta) themeMeta.setAttribute("content", dark ? "#171021" : "#FFF9F2");
    if (persist) store.set("yenilume.site.mode", dark ? "dark" : "light");
  }

  const savedMode = store.get("yenilume.site.mode");
  applyMode(savedMode === "dark" || savedMode === "light" ? savedMode : prefersDark.matches ? "dark" : "light", false);
  modeToggle?.addEventListener("click", () => {
    applyMode(root.dataset.mode === "dark" ? "light" : "dark");
  });

  /* ---------------- navigation ---------------- */
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");

  const onScroll = () => nav?.classList.toggle("is-stuck", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    nav?.classList.remove("is-open");
    burger?.setAttribute("aria-expanded", "false");
    burger?.setAttribute("aria-label", "Open menu");
  }

  burger?.addEventListener("click", () => {
    const open = !nav?.classList.contains("is-open");
    nav?.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  document.querySelectorAll("#navLinks a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (nav?.classList.contains("is-open") && !nav.contains(event.target)) closeMenu();
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealItems = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-in"));
  }

  /* ---------------- footer ---------------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
