// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public')); // frontend dosyalarını public klasöründen servis et

const SERPAPI_API_KEY = "7d4867793f69362b37c11ed4f389103510e7460a502fc7f8240f5dd8d40d25e0";

if (!SERPAPI_API_KEY) {
  console.error("SERPAPI_API_KEY .env içinde tanımlı değil!");
  process.exit(1);
}

app.get('/api/news', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "q parametresi zorunlu." });

  try {
    const serpUrl = new URL('https://serpapi.com/search.json');
    serpUrl.searchParams.append('engine', 'google_news');
    serpUrl.searchParams.append('q', query);
    serpUrl.searchParams.append('api_key', SERPAPI_API_KEY);
    serpUrl.searchParams.append('num', '10');

    const response = await fetch(serpUrl.href);
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `SerpAPI hata: ${text}` });
    }
    const data = await response.json();
    const newsResults = data.news_results || [];

    const simplifiedResults = newsResults.map(item => ({
      title: item.title,
      source: item.source,
      link: item.link,
      snippet: item.snippet,
      date: item.date
    }));

    res.json({ results: simplifiedResults });
  } catch (error) {
    console.error("SerpAPI isteğinde hata:", error);
    res.status(500).json({ error: "Sunucu hatası oluştu." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend ${PORT} portunda çalışıyor.`);
});
