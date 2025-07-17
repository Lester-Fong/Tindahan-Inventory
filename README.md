# 🏪 Tindahan Inventory System with AI Agent

A comprehensive Point-of-Sale (POS) inventory system designed for Filipino tindahan (mini grocery stores). Features modern UI with dark/light themes, mobile-first responsive design, and built-in AI agent capabilities.

## ✨ Features

### Core Functionality

- 📦 **Product Management**: Add, edit, delete products with categories
- 🛒 **Shopping Cart**: Add to cart, quantity controls, real-time totals
- 💰 **Checkout System**: Cash, GCash, and Card payment methods with change calculation
- 📊 **Sales History**: Transaction tracking with detailed reporting
- 🔍 **Search & Filter**: Real-time product search and category filtering

### UI/UX

- 📱 **Mobile-First**: Responsive design optimized for touch devices
- 🌓 **Dark/Light Theme**: Automatic theme detection with manual toggle
- 🎨 **Premium Design**: shadcn/ui + Tailwind CSS for modern aesthetics
- ⚡ **Fast Performance**: Vue 3 Composition API with optimized state management

### Data Management

- 💾 **Local Storage**: JSON-based data persistence (scalable to Firebase)
- 🔄 **Real-time Updates**: Instant UI updates with Pinia state management
- 📈 **Analytics**: Sales summaries and transaction analytics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to project directory**

   ```bash
   cd tindahan-inventory
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)
   - The app is ready to use!

### Production Build

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Adding Products

1. Click the "Add Product" button in the header or Products tab
2. Fill in product details (name, category, price, stock, etc.)
3. Click "Add Product" to save

### Making Sales

1. Browse products in the Products tab
2. Click "Add to Cart" on desired items
3. Go to Cart tab to review items
4. Adjust quantities as needed
5. Click "Proceed to Checkout"
6. Select payment method and complete transaction

### Viewing Sales

- Go to Sales tab to view transaction history
- See daily sales totals and analytics
- Review individual transaction details

## 🏗️ Project Structure

```
tindahan-inventory/
├── src/
│   ├── components/           # Vue components
│   │   ├── ui/              # Reusable UI components
│   │   ├── ProductList.vue  # Product display
│   │   ├── ShoppingCart.vue # Cart functionality
│   │   └── ...
│   ├── stores/              # Pinia state management
│   ├── types/               # TypeScript definitions
│   ├── data/                # Sample data
│   ├── composables/         # Vue composables
│   └── lib/                 # Utilities
├── public/                  # Static assets
└── TODO.md                 # Project roadmap
```

## 🛠️ Technology Stack

- **Frontend**: Vue 3 (Composition API) + TypeScript
- **Styling**: Tailwind CSS + shadcn/vue
- **State Management**: Pinia
- **Build Tool**: Vite
- **Icons**: Lucide Vue Next
- **Data Storage**: JSON (local) → Firebase (future)

## 📱 Supported Devices

- ✅ Mobile phones (iOS/Android)
- ✅ Tablets
- ✅ Desktop browsers
- ✅ Touch-screen devices

## 🎯 Sample Products Included

The system comes with sample Filipino tindahan products:

- Canned goods (Argentina Corned Beef, Ligo Sardines)
- Crackers (SkyFlakes, Fita)
- Cooking oils (Baguio, Minola)
- Biscuits (Marie, Cream-O)
- Beverages (Coca-Cola, Sprite)
- Instant noodles (Lucky Me!, Maggi)
- Rice and snacks

## 🚦 Development Status

### ✅ Completed Features

- Product management (CRUD)
- Shopping cart with checkout
- Sales history and analytics
- Responsive design with dark/light themes
- Local data persistence

### 🚧 Coming Soon

- AI agent integration for price queries
- Speech-to-text functionality
- Firebase database integration
- Data import/export
- Advanced analytics

## 🤝 Contributing

This project is designed for Filipino tindahan owners. Suggestions for improvements are welcome!

## 📄 License

MIT License - feel free to use for your tindahan business!

---

Built with ❤️ for Filipino entrepreneurs
