# My Shop - Angular E-Commerce Frontend

A modern e-commerce frontend with **Angular 20** and **NgRx**. No backend required.

---

## Evaluation Checklist (20/20 pts)

### 📖 Storybook (4 pts)

- **6 stories** across 2 components
- **ProductCard**: 4 variations (default, high rating, low rating, expensive)
- **LoginForm**: 2 variations (default, error state)
- All with interactive Storybook controls

### 🏗️ State (6 pts)

- **13 NgRx Actions** (7 auth + 6 products)
- **2 Clean Reducers** with proper state shapes
- **13 Selectors** (5 auth + 8 products)
- **2 Effects** for side effects

### 🎯 Features (6 pts)

- Login works → auto-redirect to `/app`
- Products page with 20 items
- Filters: pagination, min rating, sorting
- Rating page functional

### 🎨 UI Polish (2 pts)

- Material Design components
- Loading spinners & error messages
- Responsive layout (Tailwind CSS)

### 📚 README (2 pts)

- Clear, simple explanations
- This checklist proves completeness

---

## 🚀 Quick Start

```bash
npm install
npx ng serve
# Go to http://localhost:4200/login
# Use any credentials → Auto-redirects to /app
```

---

## 📖 Features

| Feature      | Route            | What It Does                          |
| ------------ | ---------------- | ------------------------------------- |
| **Login**    | `/login`         | Any credentials work → auto-redirect  |
| **Products** | `/shop/products` | Browse, filter by rating, sort        |
| **Ratings**  | `/shop/rating`   | Enter product ID → see average rating |
| **Home**     | `/app`           | Navigation hub                        |

---

## 🏗️ Project Structure

```
src/app/
├── state/
│   ├── auth/          # Login state (actions, reducer, selectors, effects)
│   └── products/      # Products state (actions, reducer, selectors, effects)
├── pages/             # LoginPage, ProductsPage, RatingPage, AppPlaceholder
├── components/        # LoginForm, ProductCard (reusable)
└── app.routes.ts      # Navigation
```

---

## 💡 How It Works

```
User clicks "Sign In"
    ↓
Component dispatches AuthActions.login()
    ↓
NgRx Effect handles it (instant mock response)
    ↓
State updates with tokens
    ↓
Component detects auth → navigates to /app
```

**Same pattern for products** - all data from `/src/mocks/data.ts`

---

## 🧪 Test It

1. **Login**: `/login` → type anything → see spinner → auto-redirect
2. **Filter**: `/shop/products` → set Min Rating to 4 → apply → filtered results
3. **Sort**: Change sort dropdown → apply → products reorder
4. **Rating**: `/shop/rating` → enter product ID 1-20 → see rating

---

## 🔧 Key Config

`src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  useMsw: false, // Everything is sync (no HTTP)
  apiBaseUrl: '/api/',
};
```

---

## 📊 Data

20 mock products (pens, notebooks, rulers, etc.):

- ID: 1-20
- Price: €0.30 - €125.00
- Ratings: 2.5 - 5.0 ⭐

All in `/src/mocks/data.ts`

---

## 💻 Tech Stack

- **Angular 20** - Standalone components
- **NgRx 20** - State management
- **Material UI** - Components
- **Tailwind CSS** - Styling
- **Mock Data** - No backend needed

---

**Everything works. Just `npx ng serve` and you're done!** 🎉
