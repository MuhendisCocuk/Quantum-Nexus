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
    const numStars = 100; // Yıldız sayısı
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        // Hata düzeltmesi: Template literals (`) kullanıldı
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = `${Math.random() * 3 + 1}px`;
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

// *** YENİ: Harici JSON dosyalarından yüklenecek birleşik veri ***
let allSearchableData = [];
// *** YENİ: Yüklenecek JSON dosyalarının listesi ***
// Hata düzeltmesi: jsonFiles dizisi elemanları doğru ayrıldı
const jsonFiles = ['data1.json', 'data2.json', 'data3.json', 'data4.json', 'data5.json', 'data6.json']; // Buraya tüm JSON dosyalarınızın adlarını ekleyin

// Harici JSON dosyalarını yükleyen fonksiyon
async function loadAllExternalData() {
    const fetchPromises = jsonFiles.map(file =>
        fetch(file)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP hata kodu: ${response.status} - Dosya: ${file}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Dosya yüklenirken hata oluştu (${file}):`, error);
                return []; // Hata durumunda boş bir dizi döndür ki diğer dosyalar etkilenmesin
            })
    );

    try {
        const results = await Promise.all(fetchPromises);
        // Tüm yüklenen dizileri tek bir büyük dizide birleştir
        allSearchableData = results.flat(); // .flat() birden fazla iç içe diziyi düzleştirir
        console.log("Tüm harici veriler başarıyla yüklendi ve birleştirildi:", allSearchableData);
    } catch (error) {
        console.error("Tüm harici veriler yüklenirken genel bir hata oluştu:", error);
        allSearchableData = []; // Herhangi bir büyük hata durumunda boş kalır
    }
}

// Gündem haberleri (örnek veri - daha fazla ve çeşitli)
let newsData = [{
    title: "Mars Kolonisi Genişliyor: İkinci Şehir Kuruldu",
    desc: "2100'lerin ortalarında, Mars'taki insan varlığı önemli ölçüde arttı. Artık birden fazla şehir, Kızıl Gezegen'in yüzeyini süslüyor."
}, {
    title: "Teleportasyon Teknolojisi Kamu Kullanımına Açıldı",
    desc: "Özel ışınlanma cihazları artık belirli rotalarda kamu taşımacılığının bir parçası. Ancak, uzun mesafeli seyahatler hala güvenlik kontrollerine tabi."
}, {
    title: "Sentient Yapay Zekalar Evrensel Vatandaşlık Hakkı Kazandı",
    desc: "Yapay zekanın evrimi, insansı robotlara tam haklar tanıyan uluslararası bir anlaşmayla zirveye ulaştı. Şimdi robotlar da seçimlere katılabiliyor."
}, {
    title: "Büyük Okyanus Temizleme Projesi Başarılı Oldu",
    desc: "Yüzyıllık kirlilik, devasa robot filoları ve biyolojik temizleyiciler sayesinde Pasifik Okyanusu'ndan tamamen arındırıldı."
}, {
    title: "Kuantum Biyolojisi ile Yaşam Süresi Uzatıldı",
    desc: "İnsan ömrü, kuantum seviyesindeki genetik müdahaleler sayesinde ortalama 150 yıla çıkarıldı. Hastalıklar artık neredeyse geçmişte kaldı."
}, {
    title: "Sanal Gerçeklik Eğitiminde Devrim",
    desc: "Eğitim, tamamen sürükleyici sanal gerçeklik platformlarına taşındı. Öğrenciler tarihi olayları birinci elden deneyimleyebiliyor."
}, {
    title: "Güneş Sistemi Keşfi Hız Kesmiyor: Satürn'ün Yeni Ayı Keşfedildi",
    desc: "Uzay ajansları, Satürn'ün halkaları arasında daha önce görülmemiş, üzerinde yaşam belirtileri olabilecek yeni bir uydu keşfetti."
}, {
    title: "Küresel Enerji Ağı Tamamen Yenilenebilir Kaynaklara Geçti",
    desc: "Tüm dünya, füzyon enerjisi, gelişmiş güneş panelleri ve rüzgar çiftlikleri sayesinde %100 temiz enerji ile güçleniyor."
}, {
    title: "Empati Çipleri ile Toplumsal Huzur Yükseliyor",
    desc: "İnsanların birbirini daha iyi anlamasını sağlayan, beyne entegre edilebilir empati çipleri toplumsal çatışmaları azaltıyor."
}, {
    title: "Uzay Turizmi Sıradanlaştı: Ay'a Hafta Sonu Kaçamakları",
    desc: "Ay'a veya Mars yörüngesine yapılan kısa geziler, uygun fiyatlı hale gelerek popüler bir hafta sonu aktivitesi haline geldi."
}];

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
    "Yapay Zeka Etik Kurulları", "Sanal Evcil Hayvanlar", "Beyin Yıkama Önleyici Teknolojileri",
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
        for (let i = loadedNewsCount; i < loadedNewsCount + newsBatchSize && i < newsData.length; i++) {
            const newsItem = document.createElement("div");
            newsItem.className = "news-item";
            newsItem.innerHTML = `<div class="news-title">${newsData[i].title}</div><div class="news-desc">${newsData[i].desc}</div>`;
            // Hata düzeltmesi: Template literals (`) kullanıldı
            newsItem.style.animationDelay = `${(i - loadedNewsCount) * 0.15}s`; // Her haber için gecikme
            fragment.appendChild(newsItem);
        }
        newsList.appendChild(fragment);
        loadedNewsCount += newsBatchSize;
        if (loadedNewsCount >= newsData.length) loader.style.display = "none";
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

// *** GÜNCELLENDİ: Arama sonuçlarını gösteren fonksiyon (Birleşik JSON verisi) ***
function displaySearchResults(query) {
    // Ana sayfa içeriğini gizle, arama sonuçlarını göster
    homepageContent.style.display = 'none';
    searchResultsContent.style.display = 'block';

    resultsDiv.innerHTML = ""; // Önceki sonuçları temizle
    searchLoader.style.display = "block"; // Yükleyiciyi göster

    if (query === "") {
        searchLoader.style.display = "none";
        resultsDiv.innerHTML = "<p class='info-message'>Boş aramayla galaksiler arası yolculuk olmaz Kaptan Pengu! Bir şeyler yazmalısın.</p>";
        return;
    }

    // Arama yüklemesi için 1.2 saniye gecikme
    setTimeout(() => {
        const normalizedQuery = query.toLowerCase();
        // Arama yapmak için artık 'externalData' yerine 'allSearchableData' kullanıyoruz
        const filteredResults = allSearchableData.filter(item =>
            item.title.toLowerCase().includes(normalizedQuery) ||
            item.description.toLowerCase().includes(normalizedQuery) ||
            (item.source && item.source.toLowerCase().includes(normalizedQuery))
        );

        searchLoader.style.display = "none";

        if (filteredResults.length > 0) {
            filteredResults.forEach(result => {
                const box = document.createElement("div");
                box.className = "result-box";
                // Hata düzeltmesi: Template literals (`) kullanıldı
                box.innerHTML = `
                    <h3>${result.title}</h3>
                    <p>${result.description}</p>
                    ${result.source ? `<p>Kaynak: <span class="source-tag">${result.source}</span></p>` : ''}
                    ${result.sourceUrl ? `<a href="${result.sourceUrl}" target="_blank" rel="noopener noreferrer">Devamını Oku</a>` : ''}
                `;
                resultsDiv.appendChild(box);
            });
        } else {
            resultsDiv.innerHTML = "<p class='info-message'>Bu konu hakkında kesin bir gelecek verisi bulunamadı Kaptan Pengu. Yerel zaman çizelgesinde ilgili bir bilgiye rastlanmadı. Farklı bir arama deneyelim mi?</p>";
        }
    }, 1200);
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
    // Hata düzeltmesi: Template literals (`) kullanıldı
    history.pushState({
        query: query
    }, '', `?query=${encodeURIComponent(query)}`);
    // Ardından arama sonuçlarını göster
    displaySearchResults(query);
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    }); // Sayfanın en üstüne kaydır
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
document.addEventListener('DOMContentLoaded', async () => {
    await loadAllExternalData(); // *** ÖNEMLİ: Tüm harici veriyi DOM yüklendiğinde yükle ***

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
        alert("Kaptan Pengu, bir arama terimi girmelisin!"); // Yazım hatası düzeltildi
    }
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const input = searchInput.value.trim();
        if (input !== "") {
            navigateToSearchPage(input); // Yeni sayfaya yönlendir
        } else {
            alert("Kaptan Pengu, bir arama terimi girmelisin!"); // Yazım hatası düzeltildi
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
    if (homepageContent.style.display === 'block' && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 150)) {
        loadMoreNews();
    }
});