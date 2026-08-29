export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const STEAM_ID = "76561198914407846";
  const CSREP_URL = `https://csrep.gg/player/${STEAM_ID}`;

  try {
    const response = await fetch(CSREP_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Помилка завантаження csrep.gg (${response.status})` });
    }

    const html = await response.text();

    // Шукаємо години на сторінці csrep.gg
    // Зазвичай значення міститься у блоці статистики поруч із тегом "hrs" або "hours"
    const hoursMatch = html.match(/([\d,.]+)\s*(?:hrs|hours|годин)/i) || html.match(/"hours":\s*"?([\d,.]+)"?/i);

    if (hoursMatch && hoursMatch[1]) {
      return res.status(200).json({ 
        hours: hoursMatch[1],
        source: "csrep.gg"
      });
    }

    return res.status(404).json({ error: "Не вдалося витягнути години з csrep.gg" });
  } catch (error) {
    return res.status(500).json({ error: "Помилка сервера при запиті до csrep.gg" });
  }
}
