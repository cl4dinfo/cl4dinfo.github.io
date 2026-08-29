export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const STEAM_ID = "76561198914407846";

  try {
    // Отримуємо дані про години CS2 з XML-версії профілю Steam (вона відкрита для читання і не блокується)
    const response = await fetch(`https://steamcommunity.com/profiles/${STEAM_ID}/games?xml=1`);
    
    if (!response.ok) {
      return res.status(response.status).json({ error: "Не вдалося отримати дані зі Steam" });
    }

    const xmlText = await response.text();

    // Шукаємо appID 730 (CS2) та години у графові hoursOnRecord / hoursPlayed
    const cs2Section = xmlText.match(/<appID>730<\/appID>[\s\S]*?<\/game>/i);
    
    if (cs2Section) {
      const hoursMatch = cs2Section[0].match(/<hoursOnRecord>([\d.,]+)<\/hoursOnRecord>/i) || 
                         cs2Section[0].match(/<hoursPlayed>([\d.,]+)<\/hoursPlayed>/i);
                         
      if (hoursMatch && hoursMatch[1]) {
        return res.status(200).json({ 
          hours: hoursMatch[1],
          source: "Steam"
        });
      }
    }

    return res.status(404).json({ error: "Перевірте, чи відкритий профіль Steam (Деталі ігор -> Публічний)" });
  } catch (error) {
    return res.status(500).json({ error: "Помилка сервера" });
  }
}
