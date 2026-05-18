// Comprehensive restaurant menu data
export const menu = {
  categories: [
    {
      id: "starters",
      name: "Starters",
      emoji: "🍽️",
      description: "Begin your culinary journey",
      items: [
        {
          id: "truffle-fries",
          name: "Truffle Parmesan Fries",
          description: "Hand-cut fries tossed in truffle oil, aged parmesan, and fresh herbs",
          price: 12.99,
          image: "🍟",
          tags: ["vegetarian", "popular"],
          customizations: [
            { id: "extra-truffle", name: "Extra Truffle Oil", price: 2.00 },
            { id: "add-bacon", name: "Add Bacon Bits", price: 1.50 }
          ]
        },
        {
          id: "bruschetta",
          name: "Heirloom Tomato Bruschetta",
          description: "Grilled sourdough topped with marinated heirloom tomatoes, basil, and balsamic glaze",
          price: 10.99,
          image: "🍅",
          tags: ["vegetarian", "vegan-option"],
          customizations: [
            { id: "add-burrata", name: "Add Burrata", price: 3.00 },
            { id: "gluten-free", name: "Gluten-Free Bread", price: 1.50 }
          ]
        },
        {
          id: "calamari",
          name: "Crispy Calamari",
          description: "Lightly battered calamari with spicy marinara and lemon aioli",
          price: 13.99,
          image: "🦑",
          tags: ["seafood"],
          customizations: [
            { id: "extra-spicy", name: "Extra Spicy", price: 0 },
            { id: "add-peppers", name: "Add Cherry Peppers", price: 1.00 }
          ]
        },
        {
          id: "soup-du-jour",
          name: "French Onion Soup",
          description: "Classic caramelized onion soup with gruyère crouton",
          price: 9.99,
          image: "🍲",
          tags: ["comfort", "popular"],
          customizations: [
            { id: "extra-cheese", name: "Extra Gruyère", price: 1.50 }
          ]
        }
      ]
    },
    {
      id: "mains",
      name: "Main Courses",
      emoji: "🥩",
      description: "Signature dishes crafted with care",
      items: [
        {
          id: "spicy-chicken-sandwich",
          name: "Spicy Chicken Sandwich",
          description: "Crispy buttermilk chicken, ghost pepper aioli, pickled jalapeños, brioche bun",
          price: 16.99,
          image: "🍔",
          tags: ["spicy", "popular"],
          customizations: [
            { id: "mild", name: "Make it Mild", price: 0 },
            { id: "extra-spicy", name: "Extra Spicy", price: 0 },
            { id: "add-avocado", name: "Add Avocado", price: 2.00 },
            { id: "add-bacon", name: "Add Bacon", price: 1.50 }
          ]
        },
        {
          id: "wagyu-burger",
          name: "Wagyu Smash Burger",
          description: "Double-smashed wagyu patties, aged cheddar, caramelized onions, special sauce",
          price: 22.99,
          image: "🍔",
          tags: ["signature", "popular"],
          customizations: [
            { id: "add-egg", name: "Add Fried Egg", price: 1.50 },
            { id: "add-truffle", name: "Truffle Aioli", price: 2.00 },
            { id: "extra-patty", name: "Extra Patty", price: 6.00 }
          ]
        },
        {
          id: "pan-seared-salmon",
          name: "Pan-Seared Atlantic Salmon",
          description: "Wild-caught salmon, lemon-dill beurre blanc, roasted asparagus, fingerling potatoes",
          price: 28.99,
          image: "🐟",
          tags: ["seafood", "healthy"],
          customizations: [
            { id: "extra-veg", name: "Extra Vegetables", price: 2.00 },
            { id: "no-butter", name: "No Butter Sauce", price: 0 },
            { id: "sub-rice", name: "Sub Rice Pilaf", price: 0 }
          ]
        },
        {
          id: "filet-mignon",
          name: "8oz Filet Mignon",
          description: "Center-cut filet, red wine reduction, truffle mashed potatoes, grilled broccolini",
          price: 42.99,
          image: "🥩",
          tags: ["signature", "premium"],
          customizations: [
            { id: "rare", name: "Rare", price: 0 },
            { id: "medium-rare", name: "Medium Rare", price: 0 },
            { id: "medium", name: "Medium", price: 0 },
            { id: "well-done", name: "Well Done", price: 0 },
            { id: "add-lobster", name: "Add Lobster Tail", price: 18.00 }
          ]
        },
        {
          id: "mushroom-risotto",
          name: "Wild Mushroom Risotto",
          description: "Arborio rice, porcini & chanterelle mushrooms, white truffle oil, pecorino",
          price: 19.99,
          image: "🍄",
          tags: ["vegetarian", "comfort"],
          customizations: [
            { id: "add-chicken", name: "Add Grilled Chicken", price: 4.00 },
            { id: "add-shrimp", name: "Add Sautéed Shrimp", price: 6.00 },
            { id: "vegan", name: "Make it Vegan", price: 0 }
          ]
        },
        {
          id: "pasta-carbonara",
          name: "Classic Carbonara",
          description: "House-made spaghetti, guanciale, pecorino romano, black pepper, egg yolk",
          price: 18.99,
          image: "🍝",
          tags: ["comfort", "popular"],
          customizations: [
            { id: "add-chicken", name: "Add Grilled Chicken", price: 4.00 },
            { id: "gluten-free", name: "Gluten-Free Pasta", price: 2.00 }
          ]
        }
      ]
    },
    {
      id: "sides",
      name: "Sides",
      emoji: "🥗",
      description: "Perfect accompaniments",
      items: [
        {
          id: "caesar-salad",
          name: "Caesar Salad",
          description: "Romaine hearts, house-made caesar dressing, parmesan crisps, garlic croutons",
          price: 8.99,
          image: "🥗",
          tags: ["healthy"],
          customizations: [
            { id: "add-chicken", name: "Add Grilled Chicken", price: 4.00 },
            { id: "add-anchovies", name: "Add Anchovies", price: 1.50 }
          ]
        },
        {
          id: "mac-and-cheese",
          name: "Truffle Mac & Cheese",
          description: "Three-cheese blend, truffle breadcrumb crust, house-smoked gouda",
          price: 10.99,
          image: "🧀",
          tags: ["comfort", "vegetarian"],
          customizations: [
            { id: "add-bacon", name: "Add Bacon", price: 1.50 },
            { id: "add-lobster", name: "Add Lobster", price: 8.00 }
          ]
        },
        {
          id: "grilled-broccolini",
          name: "Charred Broccolini",
          description: "Lemon zest, chili flakes, toasted almonds",
          price: 7.99,
          image: "🥦",
          tags: ["healthy", "vegan"],
          customizations: []
        },
        {
          id: "sweet-potato-fries",
          name: "Sweet Potato Fries",
          description: "Crispy sweet potato fries with chipotle mayo",
          price: 8.99,
          image: "🍠",
          tags: ["vegetarian", "popular"],
          customizations: [
            { id: "add-truffle", name: "Truffle Oil Drizzle", price: 2.00 }
          ]
        }
      ]
    },
    {
      id: "drinks",
      name: "Beverages",
      emoji: "🥤",
      description: "Refresh and unwind",
      items: [
        {
          id: "sparkling-water",
          name: "Sparkling Water",
          description: "San Pellegrino 500ml",
          price: 3.99,
          image: "💧",
          tags: [],
          sizes: [
            { id: "regular", name: "Regular (500ml)", price: 3.99 },
            { id: "large", name: "Large (1L)", price: 5.99 }
          ],
          customizations: []
        },
        {
          id: "still-water",
          name: "Still Water",
          description: "Acqua Panna 500ml",
          price: 3.49,
          image: "💧",
          tags: [],
          sizes: [
            { id: "regular", name: "Regular (500ml)", price: 3.49 },
            { id: "large", name: "Large (1L)", price: 4.99 }
          ],
          customizations: []
        },
        {
          id: "fresh-lemonade",
          name: "House-Made Lemonade",
          description: "Fresh-squeezed with lavender honey",
          price: 5.99,
          image: "🍋",
          tags: ["popular"],
          customizations: [
            { id: "add-mint", name: "Add Fresh Mint", price: 0 },
            { id: "no-sugar", name: "Less Sugar", price: 0 }
          ]
        },
        {
          id: "espresso",
          name: "Espresso",
          description: "Double shot, single-origin beans",
          price: 4.49,
          image: "☕",
          tags: [],
          customizations: [
            { id: "decaf", name: "Decaf", price: 0 },
            { id: "oat-milk", name: "Oat Milk", price: 0.75 }
          ]
        },
        {
          id: "craft-ipa",
          name: "Local Craft IPA",
          description: "Rotating selection from local breweries",
          price: 8.99,
          image: "🍺",
          tags: ["alcohol"],
          customizations: []
        },
        {
          id: "red-wine",
          name: "House Red Wine",
          description: "Cabernet Sauvignon, Napa Valley",
          price: 12.99,
          image: "🍷",
          tags: ["alcohol"],
          customizations: []
        }
      ]
    },
    {
      id: "desserts",
      name: "Desserts",
      emoji: "🍰",
      description: "A sweet ending",
      items: [
        {
          id: "creme-brulee",
          name: "Classic Crème Brûlée",
          description: "Madagascar vanilla bean custard, caramelized sugar crust",
          price: 10.99,
          image: "🍮",
          tags: ["signature", "popular"],
          customizations: [
            { id: "add-berries", name: "Add Fresh Berries", price: 2.00 }
          ]
        },
        {
          id: "chocolate-lava",
          name: "Chocolate Lava Cake",
          description: "Warm Valrhona chocolate cake, molten center, vanilla gelato",
          price: 12.99,
          image: "🍫",
          tags: ["popular"],
          customizations: [
            { id: "add-ice-cream", name: "Extra Scoop Gelato", price: 2.50 }
          ]
        },
        {
          id: "tiramisu",
          name: "Tiramisu",
          description: "Espresso-soaked ladyfingers, mascarpone cream, cocoa dust",
          price: 11.99,
          image: "🍰",
          tags: ["classic"],
          customizations: []
        }
      ]
    }
  ]
};

// Helper to find items by various criteria
export function findMenuItem(query) {
  const normalized = query.toLowerCase().trim();
  const allItems = menu.categories.flatMap(cat => cat.items);
  
  // Exact ID match
  let found = allItems.find(item => item.id === normalized);
  if (found) return found;
  
  // Exact name match
  found = allItems.find(item => item.name.toLowerCase() === normalized);
  if (found) return found;
  
  // Partial name match
  found = allItems.find(item => item.name.toLowerCase().includes(normalized));
  if (found) return found;
  
  // Keyword match
  found = allItems.find(item => {
    const words = normalized.split(/\s+/);
    return words.every(word => 
      item.name.toLowerCase().includes(word) || 
      item.description.toLowerCase().includes(word) ||
      item.id.includes(word)
    );
  });
  
  return found || null;
}

export function searchMenuItems(query) {
  const normalized = query.toLowerCase().trim();
  const allItems = menu.categories.flatMap(cat => 
    cat.items.map(item => ({ ...item, category: cat.name }))
  );
  
  return allItems.filter(item => {
    const searchableText = `${item.name} ${item.description} ${item.tags.join(' ')} ${item.category}`.toLowerCase();
    const words = normalized.split(/\s+/);
    return words.some(word => searchableText.includes(word));
  });
}

export function getMenuCategories() {
  return menu.categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    emoji: cat.emoji,
    description: cat.description,
    itemCount: cat.items.length
  }));
}
