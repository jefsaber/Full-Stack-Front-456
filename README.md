# My Shop - Angular E-Commerce Frontend

A modern e-commerce frontend built with Angular 20 and NgRx. It's fully functional without needing any backend - everything uses mock data.

---

## Commands

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run start` | Start the development server |
| `npm test`      | Run unit tests               |
| `npm run lint`  | Run ESLint                   |
| `npm run build` | Build for production         |

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
├── app.config.ts
├── app.html
├── app.routes.ts
├── dev/
│   ├── dev-index.component.ts
│   ├── dev-auth.component.ts
│   ├── dev-products.component.ts
│   ├── dev-product-rating.component.ts
│   ├── dev-cart.component.ts
│   ├── dev-orders.component.ts
│   ├── dev-reviews.component.ts
│   ├── dev-profile.component.ts
│   └── dev-admin.component.ts
├── modules/
│   ├── shop/
│   │   └── shop.module.ts
│   ├── account/
│   │   └── account.module.ts
│   └── admin/
│       └── admin.module.ts
├── pages/
│   ├── home.component.ts
│   ├── login-page.component.ts
│   ├── products-page.component.ts
│   ├── product-details-page.component.ts
│   ├── product-rating-page.component.ts
│   ├── cart-page.component.ts
│   ├── wishlist-page.component.ts
│   ├── checkout-page.component.ts
│   ├── admin-dashboard.component.ts
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
│   ├── user/
│   │   ├── user.actions.ts
│   │   ├── user.reducer.ts
│   │   ├── user.selectors.ts
│   │   └── user.effects.ts
│   ├── wishlist/
│   ├── reviews/
│   └── admin/
├── components/
│   ├── login-form/
│   ├── product-card/
│   ├── skeleton-loader/
│   ├── cart-icon/
│   └── wishlist-icon/
├── services/
│   ├── auth.interceptor.ts
│   ├── shop-api.service.ts
│   ├── storage.service.ts
│   └── admin-dashboard.service.ts
├── mocks/
│   ├── data.ts
│   ├── handlers.ts
│   ├── promo.ts
│   ├── reviews.ts
│   ├── utils.ts
│   └── browser.ts
└── main.ts
```

---

## Available Routes

| Path                  | What You'll Find                                                        |
| --------------------- | ----------------------------------------------------------------------- |
| `/`                   | Landing / home page with dev navigation links                           |
| `/login`              | Login page - enter any credentials                                      |
| `/app`                | Alternate home that keeps the nav in view                               |
| `/shop`               | Redirects to `/shop/products` by default                                |
| `/shop/products`      | Browse all products with filters                                        |
| `/shop/products/:id`  | Detailed view of a single product                                       |
| `/shop/cart`          | Your shopping cart                                                      |
| `/shop/checkout`      | Multi-step checkout process                                             |
| `/shop/rating`        | Product ratings aggregated across the catalog                           |
| `/account/profile`    | Your profile plus newsletter and rating prefs                           |
| `/account/orders`     | Your full order history                                                 |
| `/account/orders/:id` | Detailed view of a specific past order                                  |
| `/account/wishlist`   | Wishlist items saved via NgRx / local storage                           |
| `/admin/dashboard`    | NgRx-powered admin stats dashboard                                      |
| `/dev`                | MSW playground for auth, products, cart, and reviews                    |
| `/dev/*`              | Additional dev routes (products, ratings, cart, orders, profile, admin) |

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

---

## Modular Architecture & Tooling

- `/shop`, `/account`, and `/admin` each live in their own lazy-loaded feature module so the bundle stays lean and the guards you added protect the routes consistently through `authGuard` at both the parent and child level.
- The new `AdminModule` ships the dashboard page plus its NgRx-backed selectors/effects and shares the same mock stats data that the `dev-admin` zone uses via the `/api/admin/stats` MSW handler.
- We rely on Mock Service Worker for every backend interaction (`/api/products`, `/api/orders`, `/api/admin/stats`, etc.), so the dev environment (used via `/dev` routes) mirrors the production behavior without hitting a real server.

## Performance Expectations

- Every page or list component should stay on `ChangeDetectionStrategy.OnPush` unless there is a documented need to deviate. This keeps rendering predictable across the lazy-loaded modules and ensures the dashboard, account pages, checkout, and product listings only re-render when their inputs truly change.
- Every `*ngFor` iteration over collections (products, cart items, orders, reviews, wishlist entries, recent dashboard stats, etc.) must include a `trackBy` function so Angular can reuse DOM nodes and avoid unnecessary re-render cycles.
- When you introduce new lists or page components, double-check they are standalone, set to `OnPush`, and use a `trackBy` helper tied to a stable identifier so long lists stay smooth even while mocked data updates frequently.

## Memoized Selectors

- `selectCartTotalItems` computes the total quantity of items inside the cart and can be used in badges or summaries without recalculating unless the cart state changes.
- `selectWishlistProducts` joins wishlist IDs with the product catalog so lists stay memoized and only update when either the catalog or selection shifts.
- `selectOrdersByStatus(status)` produces a filtered list of orders for the requested status (`en_cours`, `expediee`, `livree`), which is handy for dashboards and grouped views.

## Product Cache & Stale-While-Revalidate

- `/shop/products` now benefits from a simple cache keyed on the active filters. When you revisit that page with the same criteria, the UI renders instantly from the cache, then a background refresh fetches the latest data and updates the list only if the payload has actually changed.
- The implementation relies on `ProductsCacheService` plus the `refreshProducts` flow in `ProductsEffects`, so cached responses stay in sync with the mocked API while keeping navigation snappy.
- Document this behavior when extending filtering or pagination so contributors understand why the list sometimes updates a moment after it first appears.

---

## Storybook

The project ships a Storybook suite for the most interactive components. You will find five new "rich" stories under `src/app/components/*/*.stories.ts`:

- `UserProfileForm` exercises the profile form with controls for `name`, `email`, and `newsletter`, and logs submissions when the form is saved.
- `WishlistButton` lets you toggle the wishlist state, switch button sizes, and watch the console output.
- `ReviewList` renders multiple review cards, exposes a rating range control, and logs the selected review.
- `PromoSummary` shows active/expired states, live discount ranges, and logs promo actions.
- `AdminStatsCard` demonstrates different dashboard scenarios while logging refresh requests.

Run `npm run storybook` to launch the UI and interact with every control/action from your browser.

## Accessibility (a11y)

- Primary pages now expose visible focus rings via a global `:focus-visible` rule so keyboard users always know which element is active.
- Icon buttons such as the cart and wishlist links carry `aria-label` attributes, and the navigation buttons rely on real text to stay operable with assistive tech, keeping each page keyboard-friendly.
- Product details render an actual `img` element with descriptive alt text (e.g., “Photo du produit X”) and fall back to a textual placeholder, ensuring we never ship unlabeled visuals to screen readers.
- Continue to test the experience with tab/shift+tab navigation whenever you update a page or add a modal so the focus order and visibility stay intact.

---

## Quality

This section covers how to run tests, linting, and what happens during continuous integration.

- **Running unit tests**: Execute `npm test` to run the full test suite with Karma. For a single run without watch mode, use `npm test -- --no-watch --browsers=ChromeHeadless`. The project includes over 100 tests covering reducers, selectors, effects, and components.

- **Running the linter**: Execute `npm run lint` to check your code against the ESLint rules configured for Angular and TypeScript. You can automatically fix many issues by running `npm run lint -- --fix`.

- **What the CI does on pull requests**: When you open a pull request targeting the master branch, GitHub Actions automatically runs a workflow that installs dependencies, runs the linter, executes all unit tests, and builds the production bundle. If any step fails, the pull request will be blocked until the issues are resolved.

- **Running with Docker (optional)**: If you have Docker installed, you can start the application in a container. Run `docker compose up --build` from the project root. Once the container is ready, open your browser and navigate to http://localhost:4200 to access the app. This is useful for testing the application in an isolated environment without installing Node.js locally.
