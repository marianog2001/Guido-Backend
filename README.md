
Link to deploy with Render: https://guido-backend.onrender.com/

Technologies used:

Node.js: JavaScript runtime platform.

Express.js: Web framework for Node.js.

MongoDB: NoSQL database for data storage.

Handlebars: Template engine for dynamic HTML view generation.

JWT (JSON Web Tokens): For user session management.

Swagger: For API documentation.

Stripe: Payment gateway implementation.

Nodemailer: For sending emails.

Socket.io: For implementing real-time chat using websockets.



Installation

Clone the repository: git clone https://github.com/sashascode/ecommerce-api.git

Install dependencies: npm install


Environment Variables


PORT= Port

PERSISTENCE= Mongo / File system / Memory

MONGO_URL= MongoDB URL for connecting to database

MONGO_DBNAME= DataBase name

GITHUB_CLIENT_ID= Github Client Id for Github log

GITHUB_SECRET= Github secret for Github log

JWT_SECRET= Token for JWT decoding

PRODUCTION_MODE= Variable that changes the logger info level

GMAIL_USER= Gmail user for nodemailer

GMAIL_PASS= Gmail pass

STRIPE_KEY= Stripe secret key

