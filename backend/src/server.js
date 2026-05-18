import express from 'express';
import cors from 'cors';
import { processMessage } from './nlp-engine.js';
import { menu, findMenuItem, searchMenuItems, getMenuCategories } from './menu.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', restaurant: 'The Intelligent Bistro', version: '1.0.0' });
});

// Get full menu
app.get('/api/menu', (req, res) => {
  res.json({ success: true, data: menu });
});

// Get menu categories
app.get('/api/menu/categories', (req, res) => {
  res.json({ success: true, data: getMenuCategories() });
});

// Get items by category
app.get('/api/menu/category/:categoryId', (req, res) => {
  const category = menu.categories.find(c => c.id === req.params.categoryId);
  if (!category) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }
  res.json({ success: true, data: category });
});

// Get single menu item
app.get('/api/menu/item/:itemId', (req, res) => {
  const item = findMenuItem(req.params.itemId);
  if (!item) {
    return res.status(404).json({ success: false, error: 'Item not found' });
  }
  res.json({ success: true, data: item });
});

// Search menu
app.get('/api/menu/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
  }
  const results = searchMenuItems(query);
  res.json({ success: true, data: results });
});

// AI Chat endpoint - the core conversational interface
app.post('/api/chat', (req, res) => {
  const { message, cart = [], conversationHistory = [] } = req.body;
  
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ success: false, error: 'Message is required' });
  }
  
  try {
    const response = processMessage(message.trim(), cart);
    
    res.json({
      success: true,
      data: {
        ...response,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process your message. Please try again.',
      data: {
        intent: 'error',
        message: "I'm having a moment — could you try that again?",
        actions: [],
        suggestions: ['Show me the menu']
      }
    });
  }
});

// Checkout endpoint
app.post('/api/checkout', (req, res) => {
  const { cart, specialInstructions = '' } = req.body;
  
  if (!cart || cart.length === 0) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + tax;
  
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
  
  res.json({
    success: true,
    data: {
      orderId,
      items: cart,
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      specialInstructions,
      estimatedTime: '25-35 minutes',
      status: 'confirmed',
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`\n🍽️  The Intelligent Bistro API`);
  console.log(`   Running on port ${PORT}`);
  console.log(`   Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/menu`);
  console.log(`   GET  /api/menu/categories`);
  console.log(`   GET  /api/menu/category/:id`);
  console.log(`   GET  /api/menu/item/:id`);
  console.log(`   GET  /api/menu/search?q=query`);
  console.log(`   POST /api/chat`);
  console.log(`   POST /api/checkout\n`);
});
