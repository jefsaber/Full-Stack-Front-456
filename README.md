# My Shop - Angular E-Commerce Frontend

A modern e-commerce frontend built with Angular 20 and NgRx. It's fully functional without needing any backend - everything uses mock data.

---

## What's Included

### Core Features (Meets Requirements)

1. **Shopping Cart with State Management**
   - Full cart system using NgRx
   - Add, remove, and update item quantities
   - Cart data persists in browser storage
   - Real-time price calculations (shipping and tax included)

2. **Checkout Wizard (3 Steps)**
   - Step 1: Review your order summary
   - Step 2: Enter delivery address with options
   - Step 3: Final confirmation and order placement
   - Each step validates your input before proceeding

3. **Product Details Page**
   - View full information about any product
   - See stock availability with visual indicator
   - Select quantity and add to cart
   - Dynamic loading of product data

4. **Dynamic Product List**
   - Browse 20 products
   - Filter by minimum rating
   - Sort by price or name
   - Quick add-to-cart or view details

5. **User Authentication**
   - Login system that works with any credentials
   - Automatic redirect after login
   - Protected routes for authenticated users only

6. **Account Management Dashboard**
   - View your profile with personal information
   - Manage subscription preferences (newsletter)
   - Set default product rating filter
   - View complete order history
   - Access detailed information for any past order
   - See cost breakdown including taxes and shipping

7. **Additional Production Features**
   - Loading animations while data fetches
   - Error handling and user feedback
   - Toast notifications for cart actions and preference updates
   - Form validation with helpful error messages
   - Responsive design for all screen sizes
   - Dark theme throughout the app

8. **Wishlist with Persistence**
   - Save products for later using NgRx and local storage
   - Quickly add or remove products from the details page
   - Shared icon in the navbar keeps saved count in sync
   - Wishlist survives browser reloads and keeps your selections

9. **Ratings and Reviews**
   - Display existing reviews sorted and filtered on the product page
   - Show live average rating and review count per product
   - Allow authenticated users to post reviews with validation
   - Persist reviews in mocked storage so they reappear on reload

---

## Getting Started

### Installation and Running

```bash
# Install dependencies
npm install

# Start the development server
ng serve

# Open your browser and go to:
# http://localhost:4200/login
```

### How to Use

1. **Log in**: Enter any username and password - they all work
2. **Browse products**: You'll see 20 products to choose from
3. **Add to cart**: Click "Add" on any product or view details first
4. **Manage cart**: Click the cart icon to see all your items
5. **Adjust quantities**: Use the + and - buttons to change amounts
6. **Checkout**: Click "Proceed to Checkout" to complete your purchase
7. **Confirm order**: Fill in your delivery address and place the order

---

## Key Features Explained

### Shopping Cart System

The cart uses modern state management with NgRx:

- All cart data is stored in the browser (localStorage)
- Changes sync automatically
- Cart persists even if you close and reopen the browser
- Prices update automatically based on items and delivery option

### Form Validation

When you fill in the checkout form:

- Each field shows an error message if left empty
- Email format is checked
- All fields must be valid before you can proceed

### Product Information

Each product shows:

- Price in euros
- Customer rating
- Stock level with a visual progress bar
- Detailed description
- Delivery information

### Real-Time Updates

- Cart badge in the navbar updates as you add/remove items
- Product buttons change from "Add" to "Remove" when items are in your cart
- Price calculations update instantly as you change quantities

### Account Management

Once you're logged in, you can access your account from the navbar:

- **Profile Page**: See your personal information, manage newsletter subscription, and set your preferred minimum product rating
- **Orders Page**: Browse all your past orders with their status and total amount
- **Order Details**: Click on any order to see the complete breakdown including items, delivery address, taxes, shipping, and total cost

---

## Project Structure

```
src/app/
├── pages/
│   ├── login-page.component.ts
│   ├── products-page.component.ts
│   ├── product-details-page.component.ts
│   ├── cart-page.component.ts
│   ├── product-rating-page.component.ts
│   ├── checkout-page.component.ts
|   ├── wishlist-page.component.ts
│   ├── account/
│   │   ├── account-profile.component.ts
│   │   ├── account-orders.component.ts
│   │   └── account-order-details.component.ts
│   └── checkout/
│       ├── step1-summary.component.ts
│       ├── step2-address.component.ts
│       └── step3-confirm.component.ts
├── state/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   └── user/
│       ├── user.actions.ts
│       ├── user.reducer.ts
│       ├── user.selectors.ts
│       └── user.effects.ts
│   ├── wishlist/
│   └── reviews/
├── components/
│   ├── login-form/
│   ├── product-card/
│   ├── skeleton-loader/
│   └── cart-icon/
├── services/
│   ├── auth.interceptor.ts
│   ├── shop-api.service.ts
│   └── storage.service.ts
└── app.routes.ts
```

---

## Available Routes

| Path                  | What You'll Find                   |
| --------------------- | ---------------------------------- |
| `/login`              | Login page - enter any credentials |
| `/app`                | Home page with navigation options  |
| `/shop/products`      | Browse all products with filters   |
| `/shop/products/:id`  | Detailed view of a single product  |
| `/shop/cart`          | Your shopping cart                 |
| `/shop/checkout`      | Multi-step checkout process        |
| `/shop/rating`        | Check product ratings              |
| `/account/profile`    | Your profile and preferences       |
| `/account/orders`     | Your order history                 |
| `/account/orders/:id` | Detailed view of a specific order  |

---

## How the Cart Works

1. When you add a product, it's stored in the app state
2. An effect watches for cart changes and saves to browser storage
3. On page reload, a service restores your cart automatically
4. All calculations (shipping, tax) happen in real-time
5. When you place an order, the cart clears

### Pricing Rules

- Shipping is free for orders over 50 euros
- Otherwise, shipping costs 5.99 euros
- Tax is calculated at 19% of the subtotal
- Express delivery costs an extra 9.99 euros

---

## How Account Management Works

Your account information is managed with the same modern state system as the shopping cart:

- **Profile Data**: Your username, email, full name, and default address are loaded when you visit your profile
- **Preferences**: Newsletter subscription and product rating preferences are stored and can be updated instantly
- **Order History**: All your past orders are displayed with their current status
- **Order Details**: Each order shows the complete breakdown including items purchased, delivery address, cost summary, and tracking information

The system uses NgRx to manage all account data, keeping everything in sync across the application.

---

## Advanced Business Rules

### 4.1 Promotions / Promo Codes

- The checkout summary step displays a promo code input plus an Apply button; the button stays disabled when the field is empty or while a request is running.
- The payload sent to the mock `/apply-promo` endpoint contains the current cart and the entered code; the response now returns a full breakdown (`itemsTotal`, `discount`, `shipping`, `taxes`, `grandTotal`, `appliedPromos`) so the frontend renders exactly what a backend would send.
- Three codes are supported: `WELCOME10` (10% off items), `FREESHIP` (free shipping), and `VIP20` (20% off when the subtotal exceeds the mock threshold). Invalid codes, threshold violations, and empty input surface descriptive error messages.
- Discounts, shipping fees, and taxes from the promo response propagate through every summary card (summary, review, confirmation), and you can clear the active promo via the “Clear” pill button beneath the applied codes.

### 4.2 Taxes and Shipping

- Taxes and shipping values now come from the promo response (or an equivalent API) instead of being hard-coded.
- Every summary always shows subtotal, discounts, shipping, taxes, and final total in that order so the user sees a consistent breakdown.

### 4.3 Stock Awareness

- Each product exposes both `stock` and `lowStockThreshold`.
- Product pages display “In stock”, “Only X left”, or “Out of stock” according to the defined thresholds.
- The Add to Cart button disables immediately when `stock === 0`, preventing purchases of sold-out products.

---

## Technology Used

- **Angular 20**: Modern framework with standalone components
- **NgRx**: State management with actions, reducers, and selectors
- **Angular Material**: UI components and icons
- **Tailwind CSS**: Utility-based styling
- **Mock Service Worker**: Simulates backend API calls
- **RxJS**: Reactive programming with observables

---

## Testing the Features

1. Add multiple items and adjust quantities to see real-time updates
2. Try the cart on different browsers - your items stay there
3. Fill in the checkout form - you'll see validation messages for any errors
4. Complete an order and watch the cart clear
5. Click the cart icon to see your item count update instantly
6. Log in and navigate to "Mon Compte" to view your profile
7. Update your newsletter subscription and see the confirmation message
8. Visit your orders page to see the order history
9. Click on any order to see the complete details and cost breakdown

---

## Form Validation

When filling out the checkout address:

- First name, last name, email, street, city, ZIP, country, and phone are all required
- Email must be in a valid format
- All fields must be completed before you can proceed
- Clear error messages appear if something is wrong

---

## Development

The app is built with standalone Angular components, which means:

- Each component is self-contained
- No need for NgModules
- Easier to understand and maintain
- Routing is simple and straightforward

All state changes go through NgRx:

- Actions describe what happened
- Reducers update the state
- Selectors get data from state
- Effects handle side effects like saving to storage

---

## No Backend Required

Everything in this app uses mock data:

- Products are stored locally
- API calls are simulated
- Order data is not actually saved anywhere
- It's perfect for testing and demonstration

---

## That's It

The app is ready to use. No configuration needed. Just run `ng serve` and start shopping!
