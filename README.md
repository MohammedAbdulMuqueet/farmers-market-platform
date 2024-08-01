# Farmers Market Platform

## Project Overview

The Farmers Market Platform is a full-stack web application designed to connect farmers and consumers in a streamlined digital marketplace. Farmers can register, log in, and manage their products, including adding items with details such as price, quantity, category (Fruits, Vegetables, Dairy), and images. They can also provide feedback about the platform. Consumers can register, log in, and place orders by selecting products from different categories, viewing product images and details, and submitting their orders along with payment information. The system automatically updates product quantities and removes products when out of stock. Consumers can also provide feedback and delete all products if needed. An admin can log in to review all feedback provided by farmers and consumers and has the option to delete all feedback. This project integrates user registration, product management, order processing, feedback collection, and administrative oversight into a cohesive platform.

## Features

- **Farmer Registration**: Allows farmers to register with their name, email, password, farm name, and address.
- **Consumer Registration**: Allows consumers to register with their name, email, password, and address.
- **Farmer Login**: Farmers can log in, add products (including images), and provide feedback.
- **Consumer Login**: Consumers can log in, view products by category, place orders, and provide feedback.
- **Admin Management**: Admins can log in to view and delete all feedback.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Multer
- **Others**: Bcryptjs, Mongoose

## Setup and Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/MohammedAbdulMuqueet/farmers-market-platform.git
   cd farmers-market-platform

2. **Install Dependencies**

Make sure you have Node.js and npm installed. Then, install the required dependencies:
   
   npm install

3. **Create Environment File**

Create a '.env' file in the root directory and add the following content:

   JWT_SECRET=your_jwt_secret

4. **Run the Application**

To start the server, run:

   npm start

The server will start on 'http://localhost:3000.'

## Usage

- **Farmer Registration:** Access '/farmer-register' to register a new farmer.
- **Consumer Registration:** Access '/consumer-register' to register a new consumer.
- **Farmer Login:** Access '/farmer-login' to log in as a farmer and manage products.
- **Consumer Login:** Access '/consumer-login' to log in as a consumer and place orders.
- **Admin Login:** Access '/admin/login' to log in as an admin and manage feedback.

## API Endpoints

- **POST /admin/login:** Admin login. Provides a token for admin access.
- **POST /feedback:** Post feedback (authentication required).
- **GET /feedback:** Get all feedback (authentication required).
- **DELETE /feedback:** Delete all feedback (admin access required).
- **POST /farmer-register:** Register a new farmer.
- **POST /consumer-register:** Register a new consumer.
- **POST /farmer-login:** Farmer login.
- **POST /consumer-login:** Consumer login.
- **POST /add-product:** Add a new product (authentication required).
- **GET /products/id/:** Get product details by ID.
- **GET /products/category/:** Get products by category.
- **DELETE /products:** Delete all products (admin access required).
- **GET /categories:** Get allowed product categories.
- **POST /place-order:** Place an order (authentication required).
- **GET /orders:** Get consumer orders (authentication required).

## Contributing

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.

## Acknowledgements

Thanks to the open-source community for their tools and libraries that made this project possible.