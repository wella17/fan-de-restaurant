const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: "Empanda Box",
    price: 12,
    description: "Golden, glossy empanda with an ad-ready baked finish.",
    tag: "Best Seller",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAgAA4QDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD8i6KKK+IP3EKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z",
    category: "pastries",
    available: true,
    stock: 50
  },
  {
    name: "Fresh Tray Pack",
    price: 15,
    description: "A bakery tray perfect for sharing with family and friends.",
    tag: "Family Favorite",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    category: "pastries",
    available: true,
    stock: 30
  },
  {
    name: "Sweet Veggie Hopia",
    price: 10,
    description: "Soft pastry packed fresh and ready for pickup.",
    tag: "Signature",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80",
    category: "pastries",
    available: true,
    stock: 40
  },
  {
    name: "Baked Pastry Bundle",
    price: 18,
    description: "A warm bakery bundle for gifting or group orders.",
    tag: "Bundle Deal",
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80",
    category: "pastries",
    available: true,
    stock: 25
  },
  {
    name: "Pan de Sal (6 pieces)",
    price: 8,
    description: "Classic Filipino bread rolls, soft and perfect for breakfast.",
    tag: "Traditional",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80",
    category: "bread",
    available: true,
    stock: 60
  },
  {
    name: "Ube Cheese Pandesal",
    price: 12,
    description: "Pan de sal with ube and cheese filling - a Filipino favorite.",
    tag: "Specialty",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    category: "bread",
    available: true,
    stock: 35
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fanderestaurant');

    // Clear existing products
    await Product.deleteMany({});

    // Insert new products
    await Product.insertMany(products);

    console.log('Products seeded successfully!');
    console.log(`Added ${products.length} products to the database.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();