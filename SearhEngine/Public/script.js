// script.js
const searchCategories = document.getElementById('searchCategories');
let currentSearchCategory = 'tumu'; // Varsayılan kategori "tumu"

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionBox = document.getElementById('suggestionBox');
const newsList = document.getElementById('newsList');
const loader = document.getElementById('loader');
const trendList = document.getElementById('trendList');
const homepageContent = document.getElementById('homepageContent');
const searchResultsContent = document.getElementById('searchResultsContent');
const resultsDiv = document.getElementById('results');
const searchLoader = document.getElementById('searchLoader');

const trendTopics = [
  "Kuantum Bilgisayarları", "Uzay Madenciliği", "Sanal Şehirler",
  "İklim Mühendisliği", "Robot Hukuku", "Genetik Düzenleme",
  "Holografik İletişim", "Yapay Genel Zeka", "Evrensel Gelir",
  "Gezegenler Arası Ticaret"
];

// Header küçültme animasyonu
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (!header) return;
  if (window.scrollY > 40) header.classList.add('shrink');
  else header.classList.remove('shrink');
});

function showHomepage() {
  homepageContent.style.display = 'block';
  searchResultsContent.style.display = 'none';
  resultsDiv.innerHTML = '';
}

function showSearchResults() {
  homepageContent.style.display = 'none';
  searchResultsContent.style.display = 'block';
}

// Trendleri yükle
function loadTrendTopics() {
  trendList.innerHTML = '';
  trendTopics.forEach(topic => {
    const tag = document.createElement('span');
    tag.textContent = topic;
    tag.style.cssText = 'display:inline-block; background:#222233; padding:5px 10px; margin:4px; border-radius:12px; cursor:pointer; color:#40cfff; user-select:none;';
    tag.addEventListener('click', () => {
      searchInput.value = topic;
      doSearch(topic);
    });
    trendList.appendChild(tag);
  });
}

// Arama yap
async function doSearch(query) {
  if (!query) return alert("Kaptan Pengu, bir arama terimi girmelisin!");

  showSearchResults();
  resultsDiv.innerHTML = '';
  searchLoader.style.display = 'block';

  try {
    const res = await fetch(`/api/news?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Sunucu hatası');
    const data = await res.json();

    searchLoader.style.display = 'none';

    if (!data.results || data.results.length === 0) {
      resultsDiv.innerHTML = `<p class="info-message">Bu konuda bir haber bulunamadı Kaptan Pengu.</p>`;
      return;
    }

    data.results.forEach(item => {
      const box = document.createElement('div');
      box.className = 'result-box';
      box.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.snippet || ''}</p>
        <p><small>Kaynak: ${item.source || 'Bilinmiyor'}</small></p>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer">Devamını Oku</a>
      `;
      resultsDiv.appendChild(box);
    });
  } catch (err) {
    searchLoader.style.display = 'none';
    resultsDiv.innerHTML = `<p class="info-message">Bir hata oluştu, tekrar dene Kaptan.</p>`;
    console.error(err);
  }
}

// Arama butonu ve Enter tuşu dinleyicileri
searchBtn.addEventListener('click', () => {
  doSearch(searchInput.value.trim());
});

searchInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    doSearch(searchInput.value.trim());
  }
});

// Öneri kutusu için basit filtreleme
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  suggestionBox.innerHTML = '';
  if (!q) {
    suggestionBox.style.display = 'none';
    return;
  }

  const filtered = trendTopics.filter(t => t.toLowerCase().includes(q)).slice(0,5);
  if (filtered.length === 0) {
    suggestionBox.style.display = 'none';
    return;
  }

  filtered.forEach(item => {
    const div = document.createElement('div');
    div.textContent = item;
    div.className = 'suggestion-item';
    div.style.cssText = 'padding:5px 10px; cursor:pointer; border-bottom:1px solid #333344; color:#40cfff;';
    div.addEventListener('click', () => {
      searchInput.value = item;
      suggestionBox.style.display = 'none';
      doSearch(item);
    });
    suggestionBox.appendChild(div);
  });
  suggestionBox.style.display = 'block';
});

// Başlangıç
showHomepage();
loadTrendTopics();

