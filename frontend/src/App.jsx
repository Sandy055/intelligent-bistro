import { useState, useEffect, useRef, useCallback } from 'react';

// ─── API Layer ───
const API_BASE = '/api';

async function apiCall(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Request failed');
    return data.data;
  } catch (err) {
    console.error(`API ${endpoint}:`, err);
    throw err;
  }
}

const api = {
  getMenu: () => apiCall('/menu'),
  chat: (message, cart) =>
    apiCall('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, cart }),
    }),
  checkout: (cart, specialInstructions = '') =>
    apiCall('/checkout', {
      method: 'POST',
      body: JSON.stringify({ cart, specialInstructions }),
    }),
};

// ─── Time Format ───
function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

// ─── Toast Component ───
function Toast({ toast, onDone }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2200);
    const t2 = setTimeout(onDone, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`toast ${exiting ? 'exit' : ''}`}>
      <span>{toast.icon || '✓'}</span>
      <span>{toast.text}</span>
    </div>
  );
}

// ─── Typing Indicator ───
function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

// ─── Suggestion Chips ───
function Suggestions({ items, onSelect }) {
  if (!items?.length) return null;
  return (
    <div className="suggestions">
      {items.map((s, i) => (
        <button key={i} className="suggestion-chip" onClick={() => onSelect(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}

// ─── Chat Item Card (inline in bot messages) ───
function ChatItemCard({ item, onAdd }) {
  return (
    <div className="chat-item-card" onClick={() => onAdd(item)}>
      <div className="chat-item-emoji">{item.image}</div>
      <div className="chat-item-info">
        <div className="chat-item-name">{item.name}</div>
        <div className="chat-item-desc">{item.description}</div>
        {item.tags?.length > 0 && (
          <div className="chat-item-tags">
            {item.tags.slice(0, 3).map(t => (
              <span key={t} className={`item-tag ${t}`}>{t}</span>
            ))}
          </div>
        )}
      </div>
      <div className="chat-item-price">${item.price.toFixed(2)}</div>
      <button className="chat-item-add-btn" onClick={e => { e.stopPropagation(); onAdd(item); }}>+</button>
    </div>
  );
}

// ─── Chat Category Card ───
function ChatCategoryCard({ category, onSelect }) {
  return (
    <div className="chat-category-card" onClick={() => onSelect(category)}>
      <div className="category-emoji">{category.emoji}</div>
      <div className="category-info">
        <div className="category-name">{category.name}</div>
        <div className="category-meta">{category.itemCount || category.items?.length || 0} items · {category.description}</div>
      </div>
      <div className="category-arrow">›</div>
    </div>
  );
}

// ─── Message Bubble ───
function Message({ msg, onAddItem, onSelectCategory, onSuggestion }) {
  return (
    <div className={`message ${msg.role}`}>
      <div className="message-bubble">
        <span dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }} />
        {/* Render item cards for browse/recommendation results */}
        {msg.items?.length > 0 && (
          <div className="chat-items-grid">
            {msg.items.map(item => (
              <ChatItemCard key={item.id} item={item} onAdd={onAddItem} />
            ))}
          </div>
        )}
        {/* Render category cards */}
        {msg.categories?.length > 0 && (
          <div className="chat-categories-grid">
            {msg.categories.map(cat => (
              <ChatCategoryCard key={cat.id} category={cat} onSelect={onSelectCategory} />
            ))}
          </div>
        )}
        {/* Suggestion chips */}
        {msg.suggestions?.length > 0 && (
          <Suggestions items={msg.suggestions} onSelect={onSuggestion} />
        )}
      </div>
      <div className="message-time">{formatTime(msg.timestamp)}</div>
    </div>
  );
}

// Format **bold** text to <strong>
function formatMessageText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

// ─── Menu View ───
function MenuView({ menu, cart, onAddItem, searchQuery, onSearchChange }) {
  if (!menu) return null;

  const filtered = searchQuery
    ? menu.categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
      })).filter(cat => cat.items.length > 0)
    : menu.categories;

  return (
    <div className="menu-view">
      <div className="menu-header">
        <div className="menu-title">Our Menu</div>
        <div className="menu-subtitle">Crafted with passion, served with pride</div>
      </div>
      <input
        className="menu-search"
        placeholder="Search dishes, ingredients..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
      />
      {filtered.map(category => (
        <div key={category.id} className="menu-category-section">
          <div className="menu-category-header">
            <span>{category.emoji}</span>
            <span className="menu-category-title">{category.name}</span>
            <span className="menu-category-count">{category.items.length}</span>
          </div>
          {category.items.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} className="menu-item-card" onClick={() => onAddItem(item)}>
                <div className="menu-item-left">
                  <div className="menu-item-name">{item.name}</div>
                  <div className="menu-item-desc">{item.description}</div>
                  <div className="menu-item-bottom">
                    <span className="menu-item-price">${item.price.toFixed(2)}</span>
                    {item.tags?.map(t => (
                      <span key={t} className={`item-tag ${t}`}>{t}</span>
                    ))}
                    {inCart && (
                      <span className="item-tag" style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>
                        ×{inCart.quantity} in cart
                      </span>
                    )}
                  </div>
                </div>
                <div className="menu-item-emoji-container">{item.image}</div>
                <button className="menu-add-btn" onClick={e => { e.stopPropagation(); onAddItem(item); }}>+</button>
              </div>
            );
          })}
        </div>
      ))}
      {filtered.length === 0 && (
        <div className="cart-empty">
          <div className="cart-empty-icon">🔍</div>
          <div className="cart-empty-text">No dishes match "{searchQuery}"</div>
        </div>
      )}
    </div>
  );
}

// ─── Cart View ───
function CartView({ cart, onUpdateQty, onRemove, onCheckout, onGoToMenu, orderConfirmation }) {
  if (orderConfirmation) {
    return (
      <div className="cart-view">
        <div className="cart-scroll">
          <div className="order-confirmation">
            <div className="order-check">✓</div>
            <div className="order-id">{orderConfirmation.orderId}</div>
            <div className="order-confirmed-title">Order Confirmed!</div>
            <div className="order-eta">Estimated: {orderConfirmation.estimatedTime}</div>
            <div className="order-total-banner">
              <div className="cart-summary">
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>${orderConfirmation.subtotal.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Tax</span>
                  <span>${orderConfirmation.tax.toFixed(2)}</span>
                </div>
                <div className="cart-summary-row total">
                  <span>Total</span>
                  <span className="amount">${orderConfirmation.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button className="new-order-btn" onClick={onGoToMenu}>Start New Order</button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-view">
        <div className="cart-scroll">
          <div className="cart-header">
            <div className="cart-title">Your Cart</div>
          </div>
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <div className="cart-empty-text">
              Your cart is empty.<br />
              Browse the menu or ask our AI for recommendations!
            </div>
            <button className="cart-empty-btn" onClick={onGoToMenu}>Browse Menu</button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * 0.0875;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="cart-view">
      <div className="cart-scroll">
        <div className="cart-header">
          <div className="cart-title">Your Cart</div>
          <div className="cart-count">{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
        </div>
        {cart.map(item => (
          <div key={item.cartId} className="cart-item">
            <div className="cart-item-emoji">{item.image}</div>
            <div className="cart-item-info">
              <div className="cart-item-name">{item.name}</div>
              <div className="cart-item-price">${item.price.toFixed(2)} each</div>
              {item.size && (
                <div className="cart-item-price" style={{ color: 'var(--text-tertiary)' }}>Size: {item.size}</div>
              )}
              <div className="cart-item-controls">
                <button
                  className={`qty-btn ${item.quantity === 1 ? 'remove' : ''}`}
                  onClick={() => item.quantity === 1 ? onRemove(item.cartId) : onUpdateQty(item.cartId, -1)}
                >
                  {item.quantity === 1 ? '✕' : '−'}
                </button>
                <span className="cart-item-qty">{item.quantity}</span>
                <button className="qty-btn" onClick={() => onUpdateQty(item.cartId, 1)}>+</button>
              </div>
            </div>
            <div className="cart-item-total">${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="cart-footer">
        <div className="cart-summary">
          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Tax (8.75%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <span className="amount">${total.toFixed(2)}</span>
          </div>
        </div>
        <button className="checkout-btn" onClick={onCheckout}>
          Place Order · ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───
let cartIdCounter = 0;
function nextCartId() { return `cart-${++cartIdCounter}-${Date.now()}`; }

export default function App() {
  // ─── State ───
  const [activeTab, setActiveTab] = useState('chat');
  const [menu, setMenu] = useState(null);
  const [cart, setCart] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  const [menuSearch, setMenuSearch] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ─── Load Menu on Mount ───
  useEffect(() => {
    api.getMenu().then(data => {
      setMenu(data);
      // Welcome message
      setMessages([{
        id: 'welcome',
        role: 'bot',
        text: "Welcome to **The Intelligent Bistro** ✨\n\nI'm your AI dining assistant. Tell me what you're craving, ask for recommendations, or just say \"show me the menu\" — I'll take care of the rest.",
        suggestions: ['Show me the menu', 'What do you recommend?', "What's popular?", 'Any vegetarian options?'],
        timestamp: Date.now(),
      }]);
    }).catch(() => {
      setMessages([{
        id: 'error',
        role: 'bot',
        text: "I'm having trouble connecting to the kitchen. Please refresh and try again!",
        suggestions: [],
        timestamp: Date.now(),
      }]);
    });
  }, []);

  // ─── Auto-scroll chat ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ─── Show toast ───
  const showToast = useCallback((text, icon = '✓') => {
    setToast({ text, icon, key: Date.now() });
  }, []);

  // ─── Cart Operations ───
  const addToCart = useCallback((item, quantity = 1, size = null) => {
    setCart(prev => {
      // Check if same item+size already in cart
      const existingIdx = prev.findIndex(c => c.id === item.id && c.size === size);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], quantity: updated[existingIdx].quantity + quantity };
        return updated;
      }
      return [...prev, {
        cartId: nextCartId(),
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
        size,
      }];
    });
    showToast(`Added ${quantity}× ${item.name}`, '🛒');
  }, [showToast]);

  const removeFromCart = useCallback((cartId) => {
    setCart(prev => {
      const item = prev.find(c => c.cartId === cartId);
      if (item) showToast(`Removed ${item.name}`, '🗑️');
      return prev.filter(c => c.cartId !== cartId);
    });
  }, [showToast]);

  const updateCartQty = useCallback((cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId !== cartId) return item;
      const newQty = item.quantity + delta;
      return newQty > 0 ? { ...item, quantity: newQty } : item;
    }).filter(item => item.quantity > 0));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Cart cleared', '🗑️');
  }, [showToast]);

  // ─── Process AI actions ───
  const processActions = useCallback((actions) => {
    if (!actions?.length || !menu) return;

    for (const action of actions) {
      if (action.type === 'add_to_cart') {
        // Action shape from backend: { type, item: { itemId, name, quantity, size, price, customizations } }
        const info = action.item || action;
        const itemId = info.itemId || info.id;
        const fullItem = menu.categories.flatMap(c => c.items).find(i => i.id === itemId);
        if (fullItem) {
          addToCart(fullItem, info.quantity || 1, info.size || null);
        }
      } else if (action.type === 'remove_from_cart') {
        const info = action.item || action;
        const itemId = info.itemId || info.id;
        const cartItem = cart.find(c => c.id === itemId);
        if (cartItem) removeFromCart(cartItem.cartId);
      } else if (action.type === 'clear_cart') {
        clearCart();
      } else if (action.type === 'modify_item' || action.type === 'update_quantity') {
        const info = action.item || action;
        const itemId = info.itemId || info.id;
        const cartItem = cart.find(c => c.id === itemId);
        if (cartItem && info.quantity) {
          setCart(prev => prev.map(c =>
            c.cartId === cartItem.cartId ? { ...c, quantity: info.quantity } : c
          ));
          showToast(`Updated ${cartItem.name} to ×${info.quantity}`, '✏️');
        }
      }
    }
  }, [menu, cart, addToCart, removeFromCart, clearCart, showToast]);

  // ─── Send Message ───
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await api.chat(text.trim(), cart);

      // Build bot message
      const botMsg = {
        id: `bot-${Date.now()}`,
        role: 'bot',
        text: response.message,
        suggestions: response.suggestions || [],
        timestamp: Date.now(),
      };

      // Attach items/categories if present in response data
      if (response.data?.items) {
        botMsg.items = response.data.items;
      }
      if (response.data?.recommendations) {
        botMsg.items = response.data.recommendations;
      }
      if (response.data?.results) {
        botMsg.items = response.data.results;
      }
      if (response.data?.categories) {
        botMsg.categories = response.data.categories;
      }

      // Process cart actions
      if (response.actions?.length > 0) {
        processActions(response.actions);
      }

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'bot',
        text: "Sorry, I had a hiccup processing that. Could you try again?",
        suggestions: ['Show me the menu', 'What do you recommend?'],
        timestamp: Date.now(),
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [cart, processActions]);

  // ─── Handlers ───
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAddItemFromUI = (item) => {
    addToCart(item);
  };

  const handleSelectCategory = (category) => {
    sendMessage(`Show me the ${category.name.toLowerCase()}`);
  };

  const handleCheckout = async () => {
    try {
      const result = await api.checkout(cart);
      setOrderConfirmation(result);
      setCart([]);
      showToast('Order placed!', '🎉');
      // Add confirmation message to chat
      setMessages(prev => [...prev, {
        id: `order-${Date.now()}`,
        role: 'bot',
        text: `🎉 Your order **${result.orderId}** has been confirmed! Estimated time: **${result.estimatedTime}**. Total: **$${result.total.toFixed(2)}**`,
        suggestions: ['Start a new order'],
        timestamp: Date.now(),
      }]);
    } catch (err) {
      showToast('Checkout failed. Try again.', '⚠️');
    }
  };

  const handleNewOrder = () => {
    setOrderConfirmation(null);
    setActiveTab('chat');
  };

  const totalCartItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="app-container">
      {/* Ambient decorations */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      {/* Toast */}
      {toast && <Toast key={toast.key} toast={toast} onDone={() => setToast(null)} />}

      {/* Header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">🍽️</div>
          <div>
            <div className="header-title">The Intelligent Bistro</div>
            <div className="header-subtitle">AI-Powered Dining</div>
          </div>
        </div>
        <button className="header-cart-btn" onClick={() => setActiveTab('cart')}>
          🛒 <span>{totalCartItems > 0 ? `$${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}` : 'Cart'}</span>
          {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
        </button>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'chat' && (
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map(msg => (
                <Message
                  key={msg.id}
                  msg={msg}
                  onAddItem={handleAddItemFromUI}
                  onSelectCategory={handleSelectCategory}
                  onSuggestion={sendMessage}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-container">
              <div className="chat-input-wrapper">
                <input
                  ref={inputRef}
                  className="chat-input"
                  placeholder="Ask me anything about our menu..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                />
                <button
                  className="chat-send-btn"
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isTyping}
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <MenuView
            menu={menu}
            cart={cart}
            onAddItem={handleAddItemFromUI}
            searchQuery={menuSearch}
            onSearchChange={setMenuSearch}
          />
        )}

        {activeTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQty={updateCartQty}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
            onGoToMenu={handleNewOrder}
            orderConfirmation={orderConfirmation}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          <span className="nav-icon">💬</span>
          <span className="nav-label">Chat</span>
        </button>
        <button className={`nav-item ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>
          <span className="nav-icon">📋</span>
          <span className="nav-label">Menu</span>
        </button>
        <button className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
          <span className="nav-icon">🛒</span>
          <span className="nav-label">Cart</span>
          {totalCartItems > 0 && (
            <span className="cart-badge" style={{ position: 'absolute', top: 2, right: 8 }}>{totalCartItems}</span>
          )}
        </button>
      </nav>
    </div>
  );
}
