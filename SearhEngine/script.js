// Header küçülme animasyonu
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if(window.scrollY > 40) {
    header.classList.add('shrink');
  } else {
    header.classList.remove('shrink');
  }
});

// Arka plan yıldız efekti
function createStars() {
  const galaxyBg = document.getElementById('galaxy-bg');
  const numStars = 100; // Yıldız sayısı
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
const newsList = document.getElementById("newsList");
const loader = document.getElementById("loader");
const trendList = document.getElementById("trendList");
const resultsDiv = document.getElementById("results"); // Arama sonuçlarının gösterileceği div
const searchLoader = document.getElementById("searchLoader"); // Arama yükleyici mesajı

// Yeni eklenenler: Sayfa bölümlerini seç
const homepageContent = document.getElementById("homepageContent");
const searchResultsContent = document.getElementById("searchResultsContent");


// Gündem haberleri (örnek veri - daha fazla ve çeşitli)
let newsData = [
  {title:"Mars Kolonisi Genişliyor: İkinci Şehir Kuruldu", desc:"2100'lerin ortalarında, Mars'taki insan varlığı önemli ölçüde arttı. Artık birden fazla şehir, Kızıl Gezegen'in yüzeyini süslüyor."},
  {title:"Teleportasyon Teknolojisi Kamu Kullanımına Açıldı", desc:"Özel ışınlanma cihazları artık belirli rotalarda kamu taşımacılığının bir parçası. Ancak, uzun mesafeli seyahatler hala güvenlik kontrollerine tabi."},
  {title:"Sentient Yapay Zekalar Evrensel Vatandaşlık Hakkı Kazandı", desc:"Yapay zekanın evrimi, insansı robotlara tam haklar tanıyan uluslararası bir anlaşmayla zirveye ulaştı. Şimdi robotlar da seçimlere katılabiliyor."},
  {title:"Büyük Okyanus Temizleme Projesi Başarılı Oldu", desc:"Yüzyıllık kirlilik, devasa robot filoları ve biyolojik temizleyiciler sayesinde Pasifik Okyanusu'ndan tamamen arındırıldı."},
  {title:"Kuantum Biyolojisi ile Yaşam Süresi Uzatıldı", desc:"İnsan ömrü, kuantum seviyesindeki genetik müdahaleler sayesinde ortalama 150 yıla çıkarıldı. Hastalıklar artık neredeyse geçmişte kaldı."},
  {title:"Sanal Gerçeklik Eğitiminde Devrim", desc:"Eğitim, tamamen sürükleyici sanal gerçeklik platformlarına taşındı. Öğrenciler tarihi olayları birinci elden deneyimleyebiliyor."},
  {title:"Güneş Sistemi Keşfi Hız Kesmiyor: Satürn'ün Yeni Ayı Keşfedildi", desc:"Uzay ajansları, Satürn'ün halkaları arasında daha önce görülmemiş, üzerinde yaşam belirtileri olabilecek yeni bir uydu keşfetti."},
  {title:"Küresel Enerji Ağı Tamamen Yenilenebilir Kaynaklara Geçti", desc:"Tüm dünya, füzyon enerjisi, gelişmiş güneş panelleri ve rüzgar çiftlikleri sayesinde %100 temiz enerji ile güçleniyor."},
  {title:"Empati Çipleri ile Toplumsal Huzur Yükseliyor", desc:"İnsanların birbirini daha iyi anlamasını sağlayan, beyne entegre edilebilir empati çipleri toplumsal çatışmaları azaltıyor."},
  {title:"Uzay Turizmi Sıradanlaştı: Ay'a Hafta Sonu Kaçamakları", desc:"Ay'a veya Mars yörüngesine yapılan kısa geziler, uygun fiyatlı hale gelerek popüler bir hafta sonu aktivitesi haline geldi."}
];

// Trend konular (örnek veri)
let trendTopics = [
  "Kuantum Bilgisayarları", "Uzay Madenciliği", "Sanal Şehirler",
  "İklim Mühendisliği", "Robot Hukuku", "Genetik Düzenleme",
  "Holografik İletişim", "Yapay Genel Zeka", "Evrensel Gelir",
  "Gezegenler Arası Ticaret"
];

let loadedNewsCount = 0;
const newsBatchSize = 4; // Her seferinde 4 haber yüklensin

// Haberleri yükle
function loadMoreNews() {
  // Haber listesi görünür değilse yükleme yapma
  if (homepageContent.style.display === 'none') return;

  if (loadedNewsCount >= newsData.length) {
    loader.style.display = "none";
    if (!document.getElementById("endOfNewsMessage")) { // Mesajı sadece bir kere ekle
      const endMessage = document.createElement("p");
      endMessage.className = "info-message";
      endMessage.id = "endOfNewsMessage";
      endMessage.textContent = "Kaptan Pengu, geleceğin tüm haberlerine ulaşıldı!";
      newsList.appendChild(endMessage);
    }
    return;
  }
  loader.style.display = "block";

  setTimeout(() => {
    let fragment = document.createDocumentFragment(); // Performans için fragment kullan
    for(let i = loadedNewsCount; i < loadedNewsCount + newsBatchSize && i < newsData.length; i++){
      const newsItem = document.createElement("div");
      newsItem.className = "news-item";
      newsItem.innerHTML = `<div class="news-title">${newsData[i].title}</div><div class="news-desc">${newsData[i].desc}</div>`;
      newsItem.style.animationDelay = `${(i - loadedNewsCount) * 0.15}s`; // Her haber için gecikme
      fragment.appendChild(newsItem);
    }
    newsList.appendChild(fragment);
    loadedNewsCount += newsBatchSize;
    if(loadedNewsCount >= newsData.length) loader.style.display = "none";
  }, 700);
}

// Trendleri yükle
function loadTrendTopics() {
  trendList.innerHTML = ''; // Öncekileri temizle
  trendTopics.forEach(topic => {
    const tag = document.createElement("span");
    tag.className = "trend-tag";
    tag.textContent = topic;
    tag.addEventListener("click", () => {
      // Trende tıklandığında inputu doldur ve URL'yi güncelle
      searchInput.value = topic;
      navigateToSearchPage(topic); // Yeni sayfa URL'sine git
    });
    trendList.appendChild(tag);
  });
}

// URL parametresini al
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Arama sonuçlarını gösteren fonksiyon (Wikipedia API entegrasyonu ile güncellendi)
function displaySearchResults(query) {
  // Ana sayfa içeriğini gizle, arama sonuçlarını göster
  homepageContent.style.display = 'none';
  searchResultsContent.style.display = 'block';

  resultsDiv.innerHTML = ""; // Önceki sonuçları temizle
  searchLoader.style.display = "block"; // Yükleyiciyi göster

  if(query === "") {
    searchLoader.style.display = "none";
    resultsDiv.innerHTML = "<p class='info-message'>Boş aramayla galaksiler arası yolculuk olmaz Kaptan Pengu! Bir şeyler yazmalısın.</p>";
    return;
  }

  // Wikipedia API URL'si
  const wikipediaApiUrl = `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=10`; // 10 sonuç al

  setTimeout(() => {
    fetch(wikipediaApiUrl)
      .then(response => {
        if (!response.ok) throw new Error('Ağ yanıtı başarısız oldu.');
        return response.json();
      })
      .then(data => {
        searchLoader.style.display = "none";

        let resultsFound = false;
        if (data.query && data.query.search.length > 0) {
          data.query.search.forEach(result => {
            const box = document.createElement("div");
            box.className = "result-box";
            // Wikipedia'dan gelen snippet'lar HTML içerebilir, temizleyelim
            const snippetText = result.snippet.replace(/<[^>]*>?/gm, ''); // HTML etiketlerini kaldır
            box.innerHTML = `<h3>${result.title}</h3><p>${snippetText}...</p><a href="https://tr.wikipedia.org/wiki/${encodeURIComponent(result.title)}" target="_blank" rel="noopener noreferrer">Devamını Oku</a>`;
            resultsDiv.appendChild(box);
            resultsFound = true;
          });
        }

        if (!resultsFound) {
            resultsDiv.innerHTML = "<p class='info-message'>Bu konu hakkında kesin bir gelecek verisi bulunamadı Kaptan Pengu. Wikipedia zaman çizelgesinde ilgili bir bilgiye rastlanmadı. Farklı bir arama deneyelim mi?</p>";
        }
      })
      .catch(err => {
        searchLoader.style.display = "none";
        resultsDiv.innerHTML = `<p class='info-message'>Kuantum hatası oluştu: ${err.message}. Lütfen daha sonra tekrar deneyin, Kaptan!</p>`;
      });
  }, 1200); // Arama yüklemesi için 1.2 saniye gecikme
}

// Ana sayfayı gösteren fonksiyon
function displayHomepage() {
  homepageContent.style.display = 'block';
  searchResultsContent.style.display = 'none';
  // Haberler ve trendler zaten yüklenecek
}

// Sayfayı yeni URL'ye yönlendiren fonksiyon
function navigateToSearchPage(query) {
    // History API ile URL'yi değiştir, sayfayı yenilemeden
    // Bu, "yeni bir sayfa" hissini verir ve geri tuşuyla çalışır
    history.pushState({ query: query }, '', `?query=${encodeURIComponent(query)}`);
    // Ardından arama sonuçlarını göster
    displaySearchResults(query);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Sayfanın en üstüne kaydır
}

// Tarayıcı geri/ileri tuşlarına basıldığında
window.addEventListener('popstate', (event) => {
    const query = getQueryParam('query');
    if (query) {
        displaySearchResults(query);
        searchInput.value = query; // Arama kutusunu doldur
    } else {
        displayHomepage();
        searchInput.value = ""; // Arama kutusunu temizle
    }
});


// Arama input placeholder metinleri
const searchPlaceholders = [
  "Zaman çizgisinde ara...",
  "Geleceğin teknolojilerini keşfet...",
  "Kuantum fiziği hakkında bilgi al...",
  "22. yüzyıl ekonomisi...",
  "Evrensel vatandaşlık hakları...",
  "Yapıcı zeka sanatını araştır...",
  "Işınlanma nasıl çalışır?",
  "Mars'ta hayat nasıl?",
  "Global enerji çözümleri...",
  "Siber güvenlik 2100..."
];
let currentPlaceholderIndex = 0;

function updateSearchPlaceholder() {
  searchInput.placeholder = searchPlaceholders[currentPlaceholderIndex];
  currentPlaceholderIndex = (currentPlaceholderIndex + 1) % searchPlaceholders.length;
}

// Başlangıç yüklemeleri
// Sayfa yüklendiğinde URL'de arama sorgusu var mı diye kontrol et
document.addEventListener('DOMContentLoaded', () => {
    const initialQuery = getQueryParam('query');
    if (initialQuery) {
        displaySearchResults(initialQuery);
        searchInput.value = initialQuery; // Arama kutusunu doldur
    } else {
        displayHomepage();
        loadMoreNews(); // Sadece ana sayfada haberleri yükle
        loadTrendTopics();
    }
    updateSearchPlaceholder(); // İlk placeholder'ı ayarla
    setInterval(updateSearchPlaceholder, 4000); // Placeholder'ı düzenli aralıklarla değiştir
});


// Arama butonu ve Enter tuşu olayları
searchBtn.addEventListener("click", () => {
  const input = searchInput.value.trim();
  if (input !== "") {
    navigateToSearchPage(input); // Yeni sayfaya yönlendir
  } else {
    alert("Kaptan Pengu, bir arama terimi girmelisin!");
  }
});

searchInput.addEventListener("keypress", (e) => {
  if(e.key === "Enter") {
    const input = searchInput.value.trim();
    if (input !== "") {
      navigateToSearchPage(input); // Yeni sayfaya yönlendir
    } else {
      alert("Kaptan Pengu, bir arama terimi girmelisin!");
    }
  }
});

// Kaydırma olayını haber yüklemesi için dinle (sadece ana sayfada)
window.addEventListener("scroll", () => {
  // Sadece ana sayfa içeriği gösteriliyorsa haber yükle
  if(homepageContent.style.display === 'block' && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 150)) {
    loadMoreNews();
  }
});