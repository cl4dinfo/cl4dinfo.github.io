export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const STEAM_ID = "76561899518063385"; // або 76561198914407846

  try {
    // Запитуємо публічні дані про гру через відкритий сервіс SteamHunter
    const response = await fetch(`https://api.steamhunter.com/v1/players/${STEAM_ID}/games`);
    
    if (response.ok) {
      const data = await response.json();
      const cs2 = data.find(game => game.appId === 730 || game.appid === 730);
      
      if (cs2 && (cs2.playtimeForever || cs2.playtime_forever)) {
        const minutes = cs2.playtimeForever || cs2.playtime_forever;
        const hours = Math.round(minutes / 60);
        return res.status(200).json({ 
          hours: hours.toLocaleString('en-US') 
        });
      }
    }

    // Резервний варіант (парсинг прямої мобільної версії сторінки Steam)
    const profileRes = await fetch(`https://steamcommunity.com/profiles/${STEAM_ID}/games/?tab=all`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
      }
    });

    const html = await profileRes.text();
    const match = html.match(/"appid":\s*730[\s\S]*?"hours_forever":\s*"([^"]+)"/);

    if (match && match[1]) {
      return res.status(200).json({ hours: match[1] });
    }

    return res.status(404).json({ error: "Не вдалося витягнути години. Перевірте SteamID" });
  } catch (error) {
    return res.status(500).json({ error: "Помилка сервера" });
  }
}
