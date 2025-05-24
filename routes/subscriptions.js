const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// Получение статуса подписки
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const subscription = await Subscription.findOne({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ expiresAt: -1 });

    if (!subscription) {
      return res.json({
        isActive: false,
        type: null,
        expiresAt: null,
      });
    }

    res.json({
      isActive: true,
      type: subscription.type,
      expiresAt: subscription.expiresAt,
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

// Создание новой подписки
router.post('/create', async (req, res) => {
  try {
    const { userId, type, stars, transactionId } = req.body;

    // Проверяем, нет ли уже активной подписки
    const existingSubscription = await Subscription.findOne({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (existingSubscription) {
      return res.status(400).json({
        error: 'User already has an active subscription'
      });
    }

    // Создаем новую подписку
    const subscription = new Subscription({
      userId,
      type,
      stars,
      transactionId,
      expiresAt: new Date(Date.now() + getDurationInDays(type) * 24 * 60 * 60 * 1000),
    });

    await subscription.save();

    res.json({
      success: true,
      subscription: {
        type: subscription.type,
        expiresAt: subscription.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Вспомогательная функция для получения длительности подписки в днях
function getDurationInDays(type) {
  switch (type) {
    case 'monthly':
      return 30;
    case 'quarterly':
      return 90;
    case 'yearly':
      return 365;
    default:
      throw new Error('Invalid subscription type');
  }
}

module.exports = router; 