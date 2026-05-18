import { findMenuItem, searchMenuItems, menu } from './menu.js';

// Comprehensive alias map for fuzzy matching
const ITEM_ALIASES = {
  // Starters
  'fries': 'truffle-fries',
  'truffle fries': 'truffle-fries',
  'french fries': 'truffle-fries',
  'bruschetta': 'bruschetta',
  'calamari': 'calamari',
  'squid': 'calamari',
  'soup': 'soup-du-jour',
  'french onion': 'soup-du-jour',
  'onion soup': 'soup-du-jour',
  
  // Mains
  'spicy chicken sandwich': 'spicy-chicken-sandwich',
  'spicy chicken sandwiches': 'spicy-chicken-sandwich',
  'chicken sandwich': 'spicy-chicken-sandwich',
  'chicken sandwiches': 'spicy-chicken-sandwich',
  'spicy chicken': 'spicy-chicken-sandwich',
  'chicken': 'spicy-chicken-sandwich',
  'burger': 'wagyu-burger',
  'wagyu': 'wagyu-burger',
  'wagyu burger': 'wagyu-burger',
  'smash burger': 'wagyu-burger',
  'salmon': 'pan-seared-salmon',
  'fish': 'pan-seared-salmon',
  'filet': 'filet-mignon',
  'filet mignon': 'filet-mignon',
  'steak': 'filet-mignon',
  'mignon': 'filet-mignon',
  'risotto': 'mushroom-risotto',
  'mushroom risotto': 'mushroom-risotto',
  'carbonara': 'pasta-carbonara',
  'pasta': 'pasta-carbonara',
  'spaghetti': 'pasta-carbonara',
  
  // Sides
  'caesar': 'caesar-salad',
  'caesar salad': 'caesar-salad',
  'salad': 'caesar-salad',
  'mac and cheese': 'mac-and-cheese',
  'mac n cheese': 'mac-and-cheese',
  'mac & cheese': 'mac-and-cheese',
  'macaroni': 'mac-and-cheese',
  'broccolini': 'grilled-broccolini',
  'broccoli': 'grilled-broccolini',
  'sweet potato fries': 'sweet-potato-fries',
  'sweet potato': 'sweet-potato-fries',
  
  // Drinks
  'water': 'still-water',
  'still water': 'still-water',
  'sparkling': 'sparkling-water',
  'sparkling water': 'sparkling-water',
  'soda water': 'sparkling-water',
  'lemonade': 'fresh-lemonade',
  'lemon': 'fresh-lemonade',
  'coffee': 'espresso',
  'espresso': 'espresso',
  'beer': 'craft-ipa',
  'ipa': 'craft-ipa',
  'wine': 'red-wine',
  'red wine': 'red-wine',
  
  // Desserts
  'creme brulee': 'creme-brulee',
  'crème brûlée': 'creme-brulee',
  'brulee': 'creme-brulee',
  'lava cake': 'chocolate-lava',
  'chocolate cake': 'chocolate-lava',
  'chocolate lava': 'chocolate-lava',
  'tiramisu': 'tiramisu',
};

// Number words to digits
const NUMBER_WORDS = {
  'a': 1, 'an': 1, 'one': 1, 'two': 2, 'three': 3, 'four': 4,
  'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
  'couple': 2, 'few': 3, 'several': 3, 'dozen': 12, 'half dozen': 6,
  'some': 2, 'another': 1, 'more': 1
};

// Size aliases
const SIZE_ALIASES = {
  'small': 'regular', 'sm': 'regular', 'regular': 'regular', 'reg': 'regular',
  'medium': 'regular', 'med': 'regular',
  'large': 'large', 'lg': 'large', 'big': 'large', 'grande': 'large'
};

function detectIntent(text) {
  const lower = text.toLowerCase().trim();
  
  // Greeting patterns
  if (/^(hi|hello|hey|howdy|good (morning|afternoon|evening)|greetings|sup|yo|what's up)/i.test(lower)) {
    return 'greeting';
  }
  
  // Category specific browse (check BEFORE generic browse to catch "show me starters" etc.)
  if (/\b(starters?|appetizers?|mains?|main course|entrees?|sides?|drinks?|beverages?|desserts?|sweets?)\b/i.test(lower) && 
      !/\b(add|want|order|get|give|i'll have|can i get)\b/i.test(lower)) {
    return 'browse_category';
  }
  
  // Dietary filter (check before browse_menu since "vegetarian options" should be dietary, not browse)
  if (/\b(vegetarian|vegan|gluten.?free|dairy.?free|nut.?free|healthy|low.?cal|keto|paleo)\b/i.test(lower)) {
    return 'dietary_filter';
  }
  
  // Help / menu browsing (generic)
  if (/\b(menu|what do you (have|serve|offer)|what's on|show me|browse|options|categories|what can i (get|order|have))\b/i.test(lower)) {
    return 'browse_menu';
  }
  
  // Recommendation
  if (/\b(recommend|suggest|popular|best|favorite|what.+good|what should|chef.+pick|special)\b/i.test(lower)) {
    return 'recommendation';
  }
  
  // Remove items
  if (/\b(remove|delete|take off|cancel|drop|get rid of|no more|don't want)\b/i.test(lower)) {
    return 'remove_item';
  }
  
  // Clear cart
  if (/\b(clear|empty|start over|reset|new order|scratch)\b/i.test(lower) && /\b(cart|order|everything|all)\b/i.test(lower)) {
    return 'clear_cart';
  }
  
  // Modify quantity
  if (/\b(change|update|modify|make it|switch to|instead)\b/i.test(lower) && /\b(\d+|more|less|fewer)\b/i.test(lower)) {
    return 'modify_item';
  }
  
  // View cart / checkout
  if (/\b(cart|order|total|check ?out|pay|bill|tab|what do i have|my order|review|summary)\b/i.test(lower) && 
      !/\b(add|want|get|give)\b/i.test(lower)) {
    return 'view_cart';
  }
  
  // Add items (broadest pattern, check last)
  if (/\b(add|want|order|get|i'll have|give me|can i (get|have)|i'd like|let me get|bring me|throw in|hook me up|please|and a|and an|two|three|four|five|one)\b/i.test(lower)) {
    return 'add_item';
  }
  
  // Item inquiry
  if (/\b(what is|tell me about|describe|ingredients|allergen|dietary|how is|is the|does the)\b/i.test(lower)) {
    return 'item_inquiry';
  }
  
  // Default: try to see if they mentioned an item name
  const allItems = menu.categories.flatMap(c => c.items);
  for (const alias of Object.keys(ITEM_ALIASES)) {
    if (lower.includes(alias)) return 'add_item';
  }
  for (const item of allItems) {
    if (lower.includes(item.name.toLowerCase())) return 'add_item';
  }
  
  return 'unknown';
}

function extractItemsFromText(text) {
  const lower = text.toLowerCase();
  const items = [];
  
  // Pattern: [quantity] [size] [item_name]
  // Try to find all item mentions with quantities
  const allItems = menu.categories.flatMap(c => c.items);
  
  // Build sorted alias list (longest first to match "spicy chicken sandwich" before "chicken")
  const sortedAliases = Object.entries(ITEM_ALIASES)
    .sort((a, b) => b[0].length - a[0].length);
  
  // Also add full item names
  for (const item of allItems) {
    const nameLower = item.name.toLowerCase();
    if (!ITEM_ALIASES[nameLower]) {
      sortedAliases.push([nameLower, item.id]);
    }
  }
  
  // Re-sort after adding full names (longest first)
  sortedAliases.sort((a, b) => b[0].length - a[0].length);
  
  let remaining = lower;
  const found = [];
  
  for (const [alias, itemId] of sortedAliases) {
    let idx = remaining.indexOf(alias);
    while (idx !== -1) {
      // Check for quantity before this item
      const before = remaining.substring(0, idx).trim();
      let quantity = 1;
      let size = null;
      
      // Check for number directly before
      const quantityMatch = before.match(/(\d+|a|an|one|two|three|four|five|six|seven|eight|nine|ten|couple|few|several|dozen|another|some|more)\s*$/i);
      if (quantityMatch) {
        const qStr = quantityMatch[1].toLowerCase();
        quantity = NUMBER_WORDS[qStr] || parseInt(qStr) || 1;
      }
      
      // Check for size
      const sizeMatch = before.match(/(small|sm|regular|reg|medium|med|large|lg|big|grande)\s*$/i);
      if (sizeMatch) {
        size = SIZE_ALIASES[sizeMatch[1].toLowerCase()];
      }
      
      // Also check for size after item name
      const after = remaining.substring(idx + alias.length).trim();
      const sizeAfterMatch = after.match(/^(small|sm|regular|reg|medium|med|large|lg|big|grande)/i);
      if (!size && sizeAfterMatch) {
        size = SIZE_ALIASES[sizeAfterMatch[1].toLowerCase()];
      }
      
      const item = allItems.find(i => i.id === itemId);
      if (item) {
        found.push({
          itemId: item.id,
          name: item.name,
          quantity,
          size,
          price: item.price,
          position: idx
        });
      }
      
      // Replace matched text to avoid double matching
      remaining = remaining.substring(0, idx) + '█'.repeat(alias.length) + remaining.substring(idx + alias.length);
      idx = remaining.indexOf(alias);
    }
  }
  
  // Sort by position in text
  found.sort((a, b) => a.position - b.position);
  
  // Deduplicate by itemId (keep first mention unless different sizes)
  const deduped = [];
  for (const item of found) {
    const existing = deduped.find(d => d.itemId === item.itemId && d.size === item.size);
    if (!existing) {
      deduped.push(item);
    }
  }
  
  return deduped;
}

function extractRemovalItems(text) {
  const lower = text.toLowerCase();
  const allItems = menu.categories.flatMap(c => c.items);
  const found = [];
  
  const sortedAliases = Object.entries(ITEM_ALIASES)
    .sort((a, b) => b[0].length - a[0].length);
  
  for (const item of allItems) {
    const nameLower = item.name.toLowerCase();
    if (!ITEM_ALIASES[nameLower]) {
      sortedAliases.push([nameLower, item.id]);
    }
  }
  
  for (const [alias, itemId] of sortedAliases) {
    if (lower.includes(alias)) {
      const item = allItems.find(i => i.id === itemId);
      if (item && !found.find(f => f.itemId === itemId)) {
        found.push({ itemId: item.id, name: item.name });
      }
    }
  }
  
  return found;
}

function extractCategory(text) {
  const lower = text.toLowerCase();
  const categoryMap = {
    'starter': 'starters', 'appetizer': 'starters', 'starters': 'starters', 'appetizers': 'starters',
    'main': 'mains', 'mains': 'mains', 'entree': 'mains', 'entrees': 'mains', 'main course': 'mains',
    'side': 'sides', 'sides': 'sides',
    'drink': 'drinks', 'drinks': 'drinks', 'beverage': 'drinks', 'beverages': 'drinks',
    'dessert': 'desserts', 'desserts': 'desserts', 'sweet': 'desserts', 'sweets': 'desserts'
  };
  
  for (const [keyword, catId] of Object.entries(categoryMap)) {
    if (lower.includes(keyword)) {
      return menu.categories.find(c => c.id === catId);
    }
  }
  return null;
}

function extractDietaryFilter(text) {
  const lower = text.toLowerCase();
  const filters = [];
  if (/vegetarian/i.test(lower)) filters.push('vegetarian');
  if (/vegan/i.test(lower)) filters.push('vegan');
  if (/gluten.?free/i.test(lower)) filters.push('gluten-free');
  if (/healthy/i.test(lower)) filters.push('healthy');
  if (/seafood/i.test(lower)) filters.push('seafood');
  if (/spicy/i.test(lower)) filters.push('spicy');
  return filters;
}

export function processMessage(text, cart = []) {
  const intent = detectIntent(text);
  
  switch (intent) {
    case 'greeting': {
      return {
        intent: 'greeting',
        message: "Welcome to The Intelligent Bistro! 🍽️ I'm your AI dining concierge. I can help you browse our menu, take your order, and manage your cart — all through conversation. What sounds good today?",
        actions: [],
        suggestions: ['Show me the menu', 'What do you recommend?', 'I\'m feeling hungry']
      };
    }
    
    case 'browse_menu': {
      const categories = menu.categories.map(c => ({
        id: c.id,
        name: c.name,
        emoji: c.emoji,
        description: c.description,
        itemCount: c.items.length,
        priceRange: `$${Math.min(...c.items.map(i => i.price)).toFixed(2)} – $${Math.max(...c.items.map(i => i.price)).toFixed(2)}`
      }));
      
      return {
        intent: 'browse_menu',
        message: "Here's what we're serving today! We have five delicious categories. Tap any to explore, or just tell me what you're in the mood for.",
        data: { categories },
        actions: [],
        suggestions: categories.map(c => `${c.emoji} ${c.name}`)
      };
    }
    
    case 'browse_category': {
      const category = extractCategory(text);
      if (!category) {
        return {
          intent: 'browse_category',
          message: "I'd be happy to show you a category! We have Starters, Main Courses, Sides, Beverages, and Desserts. Which catches your eye?",
          actions: [],
          suggestions: ['🍽️ Starters', '🥩 Main Courses', '🥗 Sides', '🥤 Beverages', '🍰 Desserts']
        };
      }
      
      return {
        intent: 'browse_category',
        message: `${category.emoji} **${category.name}** — ${category.description}. Here's what we have:`,
        data: { 
          category: category.name,
          items: category.items.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            tags: item.tags
          }))
        },
        actions: [],
        suggestions: category.items.slice(0, 3).map(i => `Add ${i.name}`)
      };
    }
    
    case 'recommendation': {
      const allItems = menu.categories.flatMap(c => c.items);
      const popular = allItems.filter(i => i.tags.includes('popular'));
      const signature = allItems.filter(i => i.tags.includes('signature'));
      const picks = [...signature, ...popular].slice(0, 4);
      
      return {
        intent: 'recommendation',
        message: "Great taste asking! Here are our chef's picks and crowd favorites — these are the dishes people can't stop talking about:",
        data: {
          recommendations: picks.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            tags: item.tags
          }))
        },
        actions: [],
        suggestions: picks.slice(0, 3).map(i => `I'll have the ${i.name}`)
      };
    }
    
    case 'add_item': {
      const items = extractItemsFromText(text);
      
      if (items.length === 0) {
        const searchResults = searchMenuItems(text);
        if (searchResults.length > 0) {
          return {
            intent: 'clarify',
            message: `I found a few options that might match what you're looking for. Did you mean one of these?`,
            data: {
              suggestions: searchResults.slice(0, 4).map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image
              }))
            },
            actions: [],
            suggestions: searchResults.slice(0, 3).map(i => `Add ${i.name}`)
          };
        }
        
        return {
          intent: 'not_found',
          message: "Hmm, I couldn't find that on our menu. Could you try describing it differently, or would you like to see what we have?",
          actions: [],
          suggestions: ['Show me the menu', 'What do you recommend?']
        };
      }
      
      const actions = items.map(item => {
        const menuItem = menu.categories.flatMap(c => c.items).find(i => i.id === item.itemId);
        let price = item.price;
        
        // Handle size pricing
        if (item.size && menuItem.sizes) {
          const sizeOption = menuItem.sizes.find(s => s.id === item.size);
          if (sizeOption) price = sizeOption.price;
        }
        
        return {
          type: 'add_to_cart',
          item: {
            itemId: item.itemId,
            name: item.name,
            quantity: item.quantity,
            size: item.size,
            price: price,
            customizations: []
          }
        };
      });
      
      const itemDescriptions = items.map(i => {
        const sizeStr = i.size ? ` (${i.size})` : '';
        const qtyStr = i.quantity > 1 ? `${i.quantity}x ` : '';
        return `${qtyStr}${i.name}${sizeStr}`;
      });
      
      const total = actions.reduce((sum, a) => sum + (a.item.price * a.item.quantity), 0);
      
      let message;
      if (items.length === 1) {
        message = `Excellent choice! Adding ${itemDescriptions[0]} to your order — that's $${total.toFixed(2)}. Anything else catch your eye?`;
      } else {
        message = `Love it! Adding ${itemDescriptions.join(' and ')} to your order — that's $${total.toFixed(2)} for these items. Want anything else?`;
      }
      
      return {
        intent: 'add_item',
        message,
        actions,
        suggestions: ['View my cart', 'What else do you recommend?', 'That\'s all for now']
      };
    }
    
    case 'remove_item': {
      const items = extractRemovalItems(text);
      
      if (items.length === 0) {
        if (cart.length === 0) {
          return {
            intent: 'remove_item',
            message: "Your cart is already empty! Would you like to start ordering?",
            actions: [],
            suggestions: ['Show me the menu', 'What do you recommend?']
          };
        }
        return {
          intent: 'clarify',
          message: "Which item would you like me to remove? Here's what's in your cart:",
          data: { cartItems: cart },
          actions: [],
          suggestions: cart.map(i => `Remove ${i.name}`)
        };
      }
      
      const actions = items.map(item => ({
        type: 'remove_from_cart',
        item: { itemId: item.itemId, name: item.name }
      }));
      
      const names = items.map(i => i.name).join(' and ');
      return {
        intent: 'remove_item',
        message: `Done! I've removed the ${names} from your order. Anything else you'd like to change?`,
        actions,
        suggestions: ['View my cart', 'Add something else', 'That looks good']
      };
    }
    
    case 'clear_cart': {
      return {
        intent: 'clear_cart',
        message: "All cleared! Your cart is now empty. Ready to start a fresh order?",
        actions: [{ type: 'clear_cart' }],
        suggestions: ['Show me the menu', 'What do you recommend?']
      };
    }
    
    case 'modify_item': {
      const items = extractItemsFromText(text);
      const quantityMatch = text.match(/(\d+)/);
      
      if (items.length > 0 && quantityMatch) {
        const newQty = parseInt(quantityMatch[0]);
        const actions = items.map(item => ({
          type: 'update_quantity',
          item: { itemId: item.itemId, name: item.name, quantity: newQty }
        }));
        
        return {
          intent: 'modify_item',
          message: `Updated! Changed ${items[0].name} quantity to ${newQty}. Your cart has been updated.`,
          actions,
          suggestions: ['View my cart', 'Anything else']
        };
      }
      
      return {
        intent: 'clarify',
        message: "What would you like to change? Tell me the item and the new quantity, like 'Change the burger to 3'.",
        actions: [],
        suggestions: cart.length > 0 ? cart.map(i => `Change ${i.name} to 2`) : ['Show me the menu']
      };
    }
    
    case 'view_cart': {
      if (cart.length === 0) {
        return {
          intent: 'view_cart',
          message: "Your cart is empty! Let's fix that. What are you in the mood for?",
          data: { cart: [], total: 0 },
          actions: [],
          suggestions: ['Show me the menu', 'What do you recommend?', 'Surprise me!']
        };
      }
      
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemLines = cart.map(item => {
        const line = `• ${item.quantity}× **${item.name}**${item.size ? ` (${item.size})` : ''} — $${(item.price * item.quantity).toFixed(2)}`;
        return line;
      }).join('\n');
      return {
        intent: 'view_cart',
        message: `Here's your current order:\n\n${itemLines}\n\n**Total: $${total.toFixed(2)}**`,
        data: { cart, total },
        actions: [],
        suggestions: ['Checkout', 'Add more items', 'Clear my cart']
      };
    }
    
    case 'item_inquiry': {
      const allItems = menu.categories.flatMap(c => c.items);
      const sortedAliases = Object.entries(ITEM_ALIASES).sort((a, b) => b[0].length - a[0].length);
      const lower = text.toLowerCase();
      
      let foundItem = null;
      for (const [alias, itemId] of sortedAliases) {
        if (lower.includes(alias)) {
          foundItem = allItems.find(i => i.id === itemId);
          break;
        }
      }
      if (!foundItem) {
        foundItem = allItems.find(i => lower.includes(i.name.toLowerCase()));
      }
      
      if (foundItem) {
        const customStr = foundItem.customizations.length > 0
          ? `\n\nAvailable add-ons: ${foundItem.customizations.map(c => `${c.name}${c.price > 0 ? ` (+$${c.price.toFixed(2)})` : ''}`).join(', ')}`
          : '';
        
        return {
          intent: 'item_inquiry',
          message: `**${foundItem.name}** — $${foundItem.price.toFixed(2)}\n\n${foundItem.description}${customStr}`,
          data: { item: foundItem },
          actions: [],
          suggestions: [`Add ${foundItem.name}`, 'Show me similar items', 'Back to menu']
        };
      }
      
      return {
        intent: 'item_inquiry',
        message: "I'd love to tell you more! Which dish are you curious about?",
        actions: [],
        suggestions: ['Show me the menu', 'What\'s popular?']
      };
    }
    
    case 'dietary_filter': {
      const filters = extractDietaryFilter(text);
      const allItems = menu.categories.flatMap(c => c.items);
      const filtered = allItems.filter(item => 
        filters.some(f => item.tags.includes(f))
      );
      
      if (filtered.length === 0) {
        return {
          intent: 'dietary_filter',
          message: `I couldn't find specific items tagged as ${filters.join('/')}, but I can help customize many dishes. Would you like to see what we can modify?`,
          actions: [],
          suggestions: ['Show me the menu', 'What do you recommend?']
        };
      }
      
      return {
        intent: 'dietary_filter',
        message: `Here are our ${filters.join(' & ')} options — great choices for a mindful meal:`,
        data: {
          items: filtered.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            image: item.image,
            tags: item.tags
          }))
        },
        actions: [],
        suggestions: filtered.slice(0, 3).map(i => `Add ${i.name}`)
      };
    }
    
    default: {
      // Try a fuzzy search as last resort
      const searchResults = searchMenuItems(text);
      if (searchResults.length > 0) {
        return {
          intent: 'search_results',
          message: "I found some items that might match what you're looking for:",
          data: {
            items: searchResults.slice(0, 4).map(item => ({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              image: item.image
            }))
          },
          actions: [],
          suggestions: searchResults.slice(0, 3).map(i => `Add ${i.name}`)
        };
      }
      
      return {
        intent: 'unknown',
        message: "I'm not quite sure what you're after, but I'm here to help! I can show you our menu, take your order, or answer questions about our dishes. What would you like?",
        actions: [],
        suggestions: ['Show me the menu', 'What do you recommend?', 'Help me order']
      };
    }
  }
}
