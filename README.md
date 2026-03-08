# NEONTHREADS — Design Your Identity 👕✨

> A full-featured custom T-shirt design and ordering platform built with React 19 + Vite. Design your own t-shirt with front and back customization, place orders, and track them in real time.

🌐 **Live Demo:** [https://dressappclient.onrender.com](https://dressappclient.onrender.com)

---

## 🚀 Pages

| Page | Route | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Landing page with featured collections |
| **Shop** | `/shop` | Product catalog with fit-type filtering |
| **Customize** | `/customize` | Dual-side t-shirt design canvas |
| **Cart** | `/cart` | Shopping basket management |
| **Checkout** | `/checkout` | Address and order confirmation |
| **Order Success** | `/order-success` | Post-purchase confirmation |
| **Login** | `/login` | User and admin authentication |
| **Sign Up** | `/signup` | New user registration |
| **My Orders** | `/my-orders` | Order history with design previews |
| **Admin Dashboard** | `/admin/dashboard` | Sales analytics overview |
| **Admin Orders** | `/admin/orders` | Order management for staff |
| **Admin Config** | `/admin/settings/notifications` | WhatsApp, toast and product settings |

---

## 🧩 Components

- **DraggableImage** — Powers the customization canvas with drag, resize and rotation support.
- **TShirtPreview** — Reusable t-shirt visualizer with instant flicker-free color switching.
- **Navbar** — Smart navigation with real-time cart count and role-based menu items.
- **NeonLoadingScreen** — API-aware splash screen that waits for server before showing app.
- **WelcomeToast** — Personalized greeting bar for authenticated users.

---

## ✨ Features

### 🎨 Customization
- **Dual-side design**: Front & Back independently.
- **Layering**: Multi-layer image upload per side.
- **Transformations**: Drag, resize, and rotate each design layer.
- **Performance**: Instant color switching with preloaded assets.
- **UX**: Mobile-friendly touch handles (24px) and D-pad movement controls for precision.

### 🛍️ Shopping
- **Catalog**: Product catalog with Normal Fit / Oversized Fit.
- **Selection**: Color and size selection.
- **Basket**: Cart with quantity management.
- **Review**: Order preview before payment.
- **Payments**: UPI payment integration (simulation).

### 📦 Order Management
- **History**: Client order history with design previews.
- **Tracking**: Real-time status tracking (Pending → Processing → Shipped → Delivered).
- **Control**: Cancel order while in Pending status.
- **Notes**: Optional personalization notes when placing orders.

### 🔧 Admin Tools
- **Analytics**: Real-time sales analytics dashboard.
- **Orders**: Full order management with status updates.
- **Inspector**: View and download client design images (ZIP bulk export supported).
- **Communication**: WhatsApp auto-notification on status change with template editor.
- **Marketing**: Remote-controlled homepage toast bar.
- **Inventory**: Full Product CRUD management.

---

## 📦 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Routing** | React Router 7 |
| **Styling** | TailwindCSS 4 + Vanilla CSS |
| **Icons** | Lucide React |
| **Interactions** | React RND + Fabric.js |
| **HTTP Client** | Axios |
| **ZIP Export** | JSZip |

---

## 🖥️ Local Development

### Prerequisites
- Node.js v18 or higher
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/Sibi-2006/DressAppClient.git

# Go to client folder
cd DressAppClient

# Install dependencies
npm install

# Create .env file
# Add your server URL in .env:
# VITE_API_URL=http://localhost:5000
```

### Start development server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🌍 Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=https://your-server-url.onrender.com
```

---

## 📁 Project Structure

```text
client/
├── public/
│   ├── assets/
│   │   ├── NORMAL_FIT/     ← Normal fit images
│   │   └── OVERSIZED_FIT/  ← Oversized fit images
│   └── _redirects          ← SPA routing fix
├── src/
│   ├── components/         ← Reusable components
│   ├── pages/              ← All page components
│   ├── context/            ← React context/state
│   ├── config/             ← API config
│   └── main.jsx            ← App entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🐛 Known Issues

- **Asset Naming**: System depends on exact image filenames in `/assets/` folder (e.g. `Normal_fit_Black_frontside.png`).
- **Mobile Drag Sensitivity**: Dragging layers on very small screens can be sensitive.

---

## 🛠️ Roadmap (Coming Soon)

- [ ] Real payment gateway integration
- [ ] Auto inventory decrease on purchase
- [ ] User profile photo and password update
- [ ] Global search bar on Shop page
- [ ] Order tracking with delivery updates
- [ ] Discount coupon system

---

## 📱 Responsive Design

Tested and optimized for:
- 📱 **Mobile**: 320px — 480px
- 📱 **Large Mobile**: 481px — 767px
- 💻 **Tablet**: 768px — 1024px
- 🖥️ **Laptop**: 1025px — 1440px
- 🖥️ **Desktop**: 1441px+

---

## 👤 Author

Built with 💙 by **Sibi**  
GitHub: [https://github.com/Sibi-2006](https://github.com/Sibi-2006)

---

## 📄 License

This project is for personal and educational use only.
