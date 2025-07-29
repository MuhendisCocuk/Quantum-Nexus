// Header küçülme animasyonu
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 40) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

// Arka plan yıldız efekti
function createStars() {
  const galaxyBg = document.getElementById('galaxy-bg');
  const numStars = 100;
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = star.style.height = `${Math.random() * 3 + 1}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    galaxyBg.appendChild(star);
  }
}
createStars();

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const searchLoader = document.getElementById("searchLoader");
const homepageContent = document.getElementById("homepageContent");
const searchResultsContent = document.getElementById("searchResultsContent");

// SerpApi API anahtarını buraya koy (https://serpapi.com/)
const SERPAPI_KEY = "7d4867793f69362b37c11ed4f389103510e7460a502fc7f8240f5dd8d40d25e0";

// SERPAPI ile arama yapma fonksiyonu
async function searchSerpApi(query) {
  const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;
  
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP hata kodu: ${response.status}`);
  return response.json();
}

// Arama sonuçlarını göster
async function displaySearchResults(query) {
  homepageContent.style.display = 'none';
  searchResultsContent.style.display = 'block';
  resultsDiv.innerHTML = "";
  searchLoader.style.display = "block";

  if (!query) {
    searchLoader.style.display = "none";
    resultsDiv.innerHTML = "<p class='info-message'>Kaptan, boş arama yapamazsın! Bir şeyler yaz.</p>";
    return;
  }

  try {
    const data = await searchSerpApi(query);
    searchLoader.style.display = "none";

    const results = data.organic_results || [];

    if (results.length > 0) {
      results.forEach(result => {
        const box = document.createElement("div");
        box.className = "result-box";
        box.innerHTML = `
          <h3>${result.title}</h3>
          <p>${result.snippet || ""}</p>
          <a href="${result.link}" target="_blank" rel="noopener noreferrer">Devamını Oku</a>
        `;
        resultsDiv.appendChild(box);
      });
    } else {
      resultsDiv.innerHTML = "<p class='info-message'>Aradığın sonuçlar bulunamadı, farklı bir arama yapalım mı?</p>";
    }
  } catch (error) {
    searchLoader.style.display = "none";
    resultsDiv.innerHTML = `<p class='info-message'>Bir hata oluştu: ${error.message}</p>`;
    console.error("SERPAPI hatası:", error);
  }
}

// URL’den query parametresi al
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Sayfayı yeni URL’ye yönlendir ve arama yap
function navigateToSearchPage(query) {
  history.pushState({ query }, '', `?query=${encodeURIComponent(query)}`);
  displaySearchResults(query);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Geri/ileri tuşu dinle
window.addEventListener('popstate', () => {
  const query = getQueryParam('query');
  if (query) {
    displaySearchResults(query);
    searchInput.value = query;
  } else {
    homepageContent.style.display = 'block';
    searchResultsContent.style.display = 'none';
    resultsDiv.innerHTML = "";
    searchInput.value = "";
  }
});

// Arama butonu ve Enter tuşu
searchBtn.addEventListener("click", () => {
  const input = searchInput.value.trim();
  if (input !== "") {
    navigateToSearchPage(input);
  } else {
    alert("Kaptan, arama terimi girmelisin!");
  }
});

searchInput.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    const input = searchInput.value.trim();
    if (input !== "") {
      navigateToSearchPage(input);
    } else {
      alert("Kaptan, arama terimi girmelisin!");
    }
  }
});

// Sayfa yüklenince URL’de query varsa arama yap
document.addEventListener('DOMContentLoaded', () => {
  const initialQuery = getQueryParam('query');
  if (initialQuery) {
    displaySearchResults(initialQuery);
    searchInput.value = initialQuery;
  } else {
    homepageContent.style.display = 'block';
    searchResultsContent.style.display = 'none';
  }
});
