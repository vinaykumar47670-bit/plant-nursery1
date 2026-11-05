# Fernwood: Online Plant Nursery System

Stack: MySQL + PHP (REST API) + React (Vite) + Bootstrap 5 + Node.js (uploads/notifications)

## Requirements
PHP 8.1+ (with pdo_mysql), MySQL or MariaDB (XAMPP works), Node.js 18+

## Next time: double-click start-nursery.bat
It starts MySQL, the PHP API, the Node service and the website, then opens http://localhost:5173.
To stop everything, double-click stop-nursery.bat. The database is saved, so your plants, users and orders stay.

## First-time setup (4 steps)
1. Database: open phpMyAdmin (or MySQL shell) and import `database/nursery.sql`.
   MySQL port is set to 3307 in `backend-php/config.php`. If your MySQL has a root password, set it there too.
2. PHP API (terminal 1):
   cd backend-php
   php -S localhost:8000
3. Node service (terminal 2):
   cd node-service
   npm install
   npm start
4. React app (terminal 3):
   cd frontend-react
   npm install
   npm run dev
   Open http://localhost:5173

## Logins
Admin: admin@nursery.com / password  (change it after first login)
Customers: use the Register form.

## Features
Customer: browse, search, filter by type/light/price, sort, plant details with care tips, reviews,
cart (saved in browser), checkout with stock check, order tracking.
Admin: dashboard (revenue, low stock, latest orders), add/edit/delete plants with photo upload,
update order status.

## Folder map
database/        MySQL schema and sample plants
backend-php/     config.php + api/ (auth, plants, orders, admin)
node-service/    server.js (image upload, order notification log)
frontend-react/  Vite + React source (pages, components, context)

## Notes
- Plant images in the sample data are Unsplash links; a leaf placeholder shows if one fails to load.
- To use XAMPP's Apache instead of `php -S`, copy backend-php into htdocs and change the proxy target in frontend-react/vite.config.js.

## Extra UI features
- Wishlist: tap the heart on any plant; saved in the browser, shown on the Wishlist page
- Toast pop-ups for add to cart and wishlist
- Quantity +/- stepper in the cart
- Loading skeletons and a result count in the shop
- Recently viewed plants on each plant page
- Animated number counters (real counts from the database) and a care corner on the home page
- Scroll progress bar, back-to-top button, smooth page fade, scroll to top on page change
