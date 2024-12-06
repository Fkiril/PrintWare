import express from 'express';
import connectedUsers from '../../utils/sseManager.js';

const router = express.Router();

// SSE Endpoint
router.get('/events/:userId', (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).send("User ID is required");
  }

  // Thiết lập header cho SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Lưu kết nối của user
  connectedUsers[userId] = res;
  console.log(`User ${userId} connected for SSE`);

  // Xóa kết nối khi user đóng
  req.on('close', () => {
    delete connectedUsers[userId];
    console.log(`User ${userId} disconnected`);
  });
});

export default router;
