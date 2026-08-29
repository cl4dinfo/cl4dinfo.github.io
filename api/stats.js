export default async function handler(req, res) {
  // Дозволяємо твоєму сайту робити запити до цієї функції
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Твій SteamID64
  const STEAM_ID = "76561199518063385"; 

  try {
    const response = await fetch(`https://steamcommunity.com/profiles/${STEAM_ID}/games/?tab=recent&l=ukrainian`);
    const text = await response.text();

    // Витягуємо години CS2 з коду сторінки Steam
    const cs2Match = text.match(/"appid":730,[^}]*"hours_forever":"([^"]+)"/);

    if (cs2Match && cs2Match[1]) {
      return res.status(200).json({ hours: cs2Match[1] });
    } else {
      return res.status(404).json({ error: "Години CS2 не знайдено" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Помилка сервера" });
  }
}
