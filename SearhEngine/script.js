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
const suggestionBox = document.getElementById("suggestionBox"); // Yeni öneri kutusu

// Yeni eklenenler: Sayfa bölümlerini seç
const homepageContent = document.getElementById("homepageContent");
const searchResultsContent = document.getElementById("searchResultsContent");

// --- JSON Dosyaları ve Veri Yükleme ---
// Haberleri tutacak boş dizi
let newsData = []; 

// Yüklenecek JSON dosyalarının isimleri (aynı klasörde varsayılıyor)
const jsonFileNames = [
    '1.json' // Örnek JSON dosya adı
      // Başka bir örnek JSON dosya adı
    // İstediğiniz kadar JSON dosyasını buraya ekleyebilirsiniz.
    // Örneğin: 'haberler.json', 'son-dakika.json' gibi.
];

// Tüm JSON dosyalarını asenkron olarak yükleyen fonksiyon
async function loadNewsFromJSON() {
    for (const fileName of jsonFileNames) {
        try {
            const response = await fetch(fileName);
            if (!response.ok) {
                throw new Error(`${fileName} dosyası yüklenemedi: ${response.statusText}`);
            }
            const data = await response.json();
            // JSON dosyasından gelen veriyi mevcut newsData'ya ekle
            newsData = newsData.concat(data); 
        } catch (error) {
            console.error(`Kaptan Pengu, ${fileName} dosyasını yüklerken bir hata oluştu:`, error);
        }
    }
    // Tüm haberler yüklendikten sonra ilk haberleri göster
    if (homepageContent.style.display === 'block' && getQueryParam('query') === null) {
        loadMoreNews(); 
    }
}
// --- JSON Dosyaları ve Veri Yükleme Bitti ---


// Trend konular (Genişletilmiş liste)
let trendTopics = [
  "Kuantum Bilgisayarları", "Uzay Madenciliği", "Sanal Şehirler",
  "İklim Mühendisliği", "Robot Hukuku", "Genetik Düzenleme",
  "Holografik İletişim", "Yapay Genel Zeka", "Evrensel Gelir",
  "Gezegenler Arası Ticaret", "Füzyon Enerjisi", "Ay Kolonileri",
  "Nöro-teknoloji", "Beyin-Bilgisayar Arayüzleri", "Uzay Yükselticileri",
  "Geliştirilmiş Gerçeklik (AR)", "Akıllı Malzemeler", "Otonom Araçlar",
  "Biyo-mühendislik", "Evrenin Kökenleri", "Zaman Yolculuğu Teorileri",
  "Karanlık Madde Araştırmaları", "Kozmik İletişim Protokolleri", "Yıldızlararası Seyahat",
  "Nanoteknoloji Uygulamaları", "Süperiletken Şehirler", "Yapay Yaşam Formları",
  "Gezegenler Arası Ekonomiler", "Dijital Ölümsüzlük", "Hafıza Transferi",
  "Kuantum Şifreleme", "Yeni Nesil Robotik Cerrahi", "Su Altı Kolonileri",
  "Gelişmiş Tıp ve İlaç Geliştirme", "Eğitim Simülasyonları", "Evrensel Çevirici Cihazlar",
  "Gezegensel Savunma Sistemleri", "Asteroit Saptırma Teknolojileri", "Sanal Anayasa Hukuku",
  "Enerji Hasadı Teknikleri", "Güneş Rüzgarı Yelkenleri", "Kromatik Şehirler",
  "Meta-Evren Mimarisi", "Doğal Dil Anlayışı (NLU) Gelişmeleri", "Uyarlanabilir Mimari",
  "Kuantum İnterneti", "Yerçekimi Kontrol Sistemleri", "Uzay Asansörleri",
  "Düşünce Okuma Cihazları", "Evrensel Kaynak Yönetimi", "Yeniden Tasarlanmış Bedenler",
  "Sentetik Gıda Üretimi", "Atık Sıfırlama Teknolojileri", "İklim Mültecileri Yerleşimi",
  "Akıllı Kumaşlar", "Yapay Organ Baskısı", "Duygu Kontrol Çipleri",
  "Geleceğin Sanatı ve Kültürü", "Nesnelerin İnterneti (IoE) Genişlemesi", "Mikro Robot Sürüleri",
  "Kuantum Algılayıcılar", "Mars Tarım Sistemleri", "Dijital İkizler",
  "Beyin-Makineler Arası Ortaklıklar", "Genomik Veri Gizliliği", "Yapay Fotoğrafçılık",
  "Otonom Denizde Taşımacılık", "Uzayda 3D Yazıcılar", "Sanal Turizm Deneyimleri",
  "Bilinç Transferi", "Kendi Kendini Onaran Malzemeler", "İnsan-Makine Hibritleri",
  "Akıllı Şehir Güvenliği", "Yenilenebilir Enerji Depolama", "Enerji Pozitif Binalar",
  "Sanal İnsanlar ve Sosyal Ağlar", "Uzay Tabanlı Güneş Enerjisi", "Hassas Tarım Robotları",
  "Holografik Eğitim Platformları", "Yapay Zeka Tabanlı Hukuk Danışmanlığı",
  "Sanal Gerçeklik Sporları", "Uzayda Atık Yönetimi", "Genetik Yaşlanma Önleyiciler",
  "Sibernetik Uzuvlar", "Kişisel Veri Ekonomisi", "Geleceğin Moda Teknolojileri",
  "Otonom Hava Taksileri", "Yapay Duygu Algılayıcılar", "Dijital Sağlık Asistanları",
  "Robotlarla İşbirliği", "Uzayda Mikro Yerçekimi Üretimi", "Biyolojik Saat Manipülasyonu",
  "İnsansı Robot Yardımcılar", "Güneş Sistemi Madenleri", "Bilgi Güvenliği Kuantum Çağı",
  "Uzayda İnsan Psikolojisi", "Yapay Zeka ile Yaratıcı Yazarlık", "Akıllı Tarım Drone’ları",
  "Küresel İklim İzleme Sistemleri", "Sentetik Biyoloji", "Nöro Pazarlama",
  "Uzayda Su Üretimi", "Beyin Gücüyle Kontrol Edilen Cihazlar", "Kuantum Algoritmaları",
  "Metaverse Ekonomileri", "Yapay Zeka ile Hukuki Tahminler", "Sanal Kişisel Asistanlar",
  "İnsan-Makine Entegrasyonları", "Derin Uzay Haberleşme", "Geleceğin Spor Teknolojileri",
  "Yapay Zeka Etik Kurulları", "Sanal Evcil Hayvanlar", "Beyin Yıkama Önleyici Teknolojiler",
  "Uzayda Tarım ve Hayvancılık", "Nöroproteksiyon Teknikleri", "Kişisel Enerji Üretimi",
  "Uzayda İnşaat Robotları", "Akıllı Ulaşım Sistemleri", "Sürdürülebilir Moda",
  "Sanal İnsan Hakları", "Uzayda Oyun ve Eğlence", "Gelecek Şehirlerin Altyapısı",
  "Yapay Zeka Tabanlı Psikoterapi", "Kişisel Genetik İlaçlar", "Uzayda Tıp Müdahaleleri",
  "Biyosensörler", "Yapay Zeka ile Finansal Yönetim", "Geleceğin Eğitim Sistemleri",
  "Uzayda Veri Merkezi Kurulumu", "Nöro-etik", "Kuantum Haberleşme Protokolleri",
  "Beyin Haritalama", "Uzayda Acil Müdahale Sistemleri", "Sanal Reklamcılık",
  "Akıllı Ev Sistemleri", "Yapay Zeka ile Sanat Yaratımı", "Sürdürülebilir Enerji Şebekeleri",
  "Kişisel Sağlık İzleme", "Uzayda Spor", "Yapay Zeka Destekli Müzik Prodüksiyonu",
  "Biyoçeşitlilik Koruma Teknolojileri", "Geleceğin Gıda Sistemleri", "Uzayda Endüstri 4.0",
  "Akıllı Uçaklar", "Sanal Gerçeklik Terapisi", "İklim Değişikliği Adaptasyonu",
  "Uzayda İnsani Yardım", "Yapay Zeka ile Oyun Tasarımı", "Beyin Bilgisayar Arayüzleri",
  "Geleceğin Ulaşım Teknolojileri", "Sanal Savaş Simülasyonları", "Yapay Zeka ile Hukuki Otomasyon"
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
      // Haber içeriğini JSON'dan gelen 'title' ve 'description' ile doldur
      newsItem.innerHTML = `<div class="news-title">${newsData[i].title}</div><div class="news-desc">${newsData[i].description || newsData[i].desc}</div>`;
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
    loadNewsFromJSON(); // JSON dosyalarını yükle
    const initialQuery = getQueryParam('query');
    if (initialQuery) {
        displaySearchResults(initialQuery);
        searchInput.value = initialQuery; // Arama kutusunu doldur
    } else {
        displayHomepage();
        // Haberler JSON'dan yüklendikten sonra 'loadMoreNews' çağrılacak
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

// Arama kutusu odak dışına çıktığında önerileri gizle (küçük bir gecikmeyle)
// Böylece kullanıcı bir öneriye tıklayabilir
searchInput.addEventListener("blur", () => {
    setTimeout(() => {
        suggestionBox.style.display = 'none';
    }, 150);
});

// Arama kutusu odaklandığında önerileri tekrar göster (eğer inputta yazı varsa)
searchInput.addEventListener("focus", () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query.length > 0 && suggestionBox.children.length > 0) {
        suggestionBox.style.display = 'block';
    }
});


// Arama inputuna yazı yazılırken önerileri göster
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  suggestionBox.innerHTML = ''; // Önceki önerileri temizle

  if (query.length > 0) {
    const filteredSuggestions = trendTopics.filter(topic =>
      topic.toLowerCase().includes(query)
    ).slice(0, 5); // İlk 5 tanesini göster

    filteredSuggestions.forEach(suggestion => {
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.textContent = suggestion;
      suggestionItem.addEventListener("click", () => {
        searchInput.value = suggestion;
        suggestionBox.innerHTML = ''; // Önerileri kapat
        navigateToSearchPage(suggestion); // Aramayı tetikle
      });
      suggestionBox.appendChild(suggestionItem);
    });
  }
  // Eğer query boşsa veya öneri yoksa kutuyu gizle
  if (suggestionBox.innerHTML === '') {
    suggestionBox.style.display = 'none';
  } else {
    suggestionBox.style.display = 'block';
  }
});


// Kaydırma olayını haber yüklemesi için dinle (sadece ana sayfada)
window.addEventListener("scroll", () => {
  // Sadece ana sayfa içeriği gösteriliyorsa haber yükle
  if(homepageContent.style.display === 'block' && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 150)) {
    loadMoreNews();
  }
});