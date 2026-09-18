# BlueChalk Backend

Node.js, Express, and MongoDB backend for the BlueChalk MERN application.

## Technology

- Node.js and Express 5 for the REST API
- MongoDB with Mongoose for data storage and modeling
- Multer for image and media uploads
- CORS and dotenv for API access and environment configuration
- JSON Web Tokens and bcryptjs for authentication support
- Nodemon for development

## Requirements

- Node.js 18 or newer
- MongoDB

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with the MongoDB connection string and server port used by your environment. For example:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/bluechalk
   PORT=5000
   JWT_SECRET=replace-with-a-long-random-secret
   JWT_EXPIRES_IN=7d
   ADMIN_EMAIL=admin@bluechalk.com
   ADMIN_PASSWORD=admin123
   ```

3. Start the server:

   ```bash
   npm start
   ```

## Home images linked to news

Home page image items are stored through the `/api/home` endpoint. Each item can contain a `blogId` that references a `News` document.

### Create an item

Send `multipart/form-data` to `POST /api/home`:

- `title`: required item title
- `type`: `image` or `video`
- `media`: optional uploaded media file
- `mediaUrl`: optional existing media URL
- `blogId`: optional MongoDB ObjectId of a `News` document
- `link`, `description`, and `order`: optional fields

If `blogId` is omitted, it is stored as `null`.

### Update an item

Send `multipart/form-data` to `PUT /api/home/:id`. Include `blogId` to link the item to a news post, or send an empty `blogId` to clear the existing link. If `blogId` is omitted, the existing value is unchanged.

## Main endpoints

- `POST /api/auth/signup` - create an admin account
- `POST /api/auth/login` - log in and receive a JWT
- `GET /api/auth/me` - return the authenticated account (`Authorization: Bearer <token>`)

- `GET /api/home` - list active home items
- `POST /api/home` - create a home item
- `PUT /api/home/:id` - update a home item
- `DELETE /api/home/:id` - delete a home item
- `GET /api/news` - list news posts
