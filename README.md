# 🛠️ Product Review Rating Api – Backend

This is the backend service built with Express + Typescript and powered by a PostgreSQL database. It provides a RESTful API for managing products and user reviews.

---

## 🔗 Live API

[https://product-review-rating-api.onrender.com](https://product-review-rating-api.onrender.com)

---

## ⚙️ Tech Stack

- Node.js + Express + TypeScript
- PostgreSQL with `pg`
- Deployed on **Render**

---

## 📦 Getting Started

### Step 1: Clone the Repository
bash
git clone https://github.com/EmbraceDahlia/product-review-rating.git
cd product-review-rating

### Step 2: Install Dependencies
bash
npm install

### Step 3: Setup Environment Variables
Create a .env file in the root with the following:
DATABASE_URL=postgresql_connection_string

### Step 4: Build and Run
bash
npm run dev

---

## 📁 API Endpoints
Base URL: https://product-review-rating-api.onrender.com

### Products
GET /products?page=1&limit=10 – Get paginated products
GET /products/search?q=phone – Search products by name
GET /products/categories – Get all product categories
GET /products/:id – Get a product by ID

### Reviews
GET /products/:id/reviews – Get all reviews for a product
POST /products/:id/reviews – Add a new review
PUT /products/:id/reviews/:reviewId – Update a review
DELETE /products/:id/reviews/:reviewId – Delete a review

---

## 🧪 Future Enhancements
Add user control

---

## 📄 License
This project is for educational/demo purposes.
