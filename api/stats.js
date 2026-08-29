export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Видаємо години напряму (можеш змінювати число в будь-який момент)
  return res.status(200).json({ 
    hours: "1 477",
    status: "ok"
  });
}
