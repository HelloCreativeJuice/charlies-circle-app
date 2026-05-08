export default function handler(req, res) {
  res.status(200).json({ success: false, error: 'Drive upload not configured' })
}
