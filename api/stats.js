export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const STEAM_ID = "76561198914407846";

  try {
    // Отримуємо HTML профілю з правильним User-Agent
    const response = await fetch(`https://steamcommunity.com/profiles/${STEAM_ID}/games/?tab=all`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    const html = await response.text();

    // Парсимо hours_forever для appid 730 (CS2)
    const match = html.match(/"appid":\s*730\b[\s\S]*?"hours_forever":\s*"([^"]+)"/);

    if (match && match[1]) {
      return res.status(200).json({ 
        hours: match[1],
        source: "Steam Profile"
      });
    }

    return res.status(404).json({ error: "Не вдалося витягнути години" });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Помилка сервера" });
  }
}
