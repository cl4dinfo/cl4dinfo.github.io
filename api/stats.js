export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const STEAM_ID = "76561198914407846";
  // Публічний ключ Steam Web API
  const API_KEY = "FC7B1F3461CA0829A72A478F686699F2"; 

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${API_KEY}&steamid=${STEAM_ID}&format=json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: "Помилка запиту до Steam API" });
    }

    const data = await response.json();
    const games = data?.response?.games;

    if (!games || games.length === 0) {
      return res.status(404).json({ error: "Ігри не знайдено або профіль приховано" });
    }

    // Шукаємо Counter-Strike 2 (appID 730)
    const cs2 = games.find(game => game.appid === 730);

    if (cs2 && cs2.playtime_forever !== undefined) {
      // Steam API повертає час у хвилинах — переводимо в години та округлюємо
      const hours = (cs2.playtime_forever / 60).toFixed(1);
      return res.status(200).json({ 
        hours: hours,
        source: "Steam API"
      });
    }

    return res.status(404).json({ error: "CS2 не знайдено на акаунті" });
  } catch (error) {
    return res.status(500).json({ error: "Помилка сервера" });
  }
}
