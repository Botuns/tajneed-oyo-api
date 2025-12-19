# Swagger/OpenAPI Documentation Guide

## 🎯 Quick Start

After starting your server, access the Swagger UI at:

```
http://localhost:<PORT>/api-docs
```

## 📖 What's Available

### Interactive UI

- **Swagger UI**: `http://localhost:<PORT>/api-docs`
  - Test all endpoints directly in browser
  - See request/response schemas
  - Try out authentication
  - No need for Postman!

### Raw Specification

- **OpenAPI JSON**: `http://localhost:<PORT>/api-docs.json`
  - Import into Postman
  - Generate client SDKs
  - Share with frontend team

## 🚀 Testing Your API

1. **Start your server**: `npm run dev`
2. **Open browser**: Go to `http://localhost:<PORT>/api-docs`
3. **Test endpoints**:
   - Click on any endpoint
   - Click "Try it out"
   - Fill in parameters
   - Click "Execute"
   - See the response!

## 📝 Adding Documentation to Routes

I've already documented the Officers routes as an example. Here's the pattern:

### Basic Route Documentation

```typescript
/**
 * @swagger
 * /your-route:
 *   get:
 *     summary: Brief description
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Success response
 */
router.get("/your-route", controller.method);
```

### Route with Parameters

```typescript
/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The item ID
 *     responses:
 *       200:
 *         description: Item found
 *       404:
 *         description: Item not found
 */
```

### Route with Request Body

```typescript
/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Item Name
 *     responses:
 *       201:
 *         description: Created
 */
```

## 🔐 Authentication

If your routes require authentication:

1. Click the "Authorize" button at the top
2. Enter your JWT token
3. All subsequent requests will include the token

## 📚 Next Steps

Apply the same documentation pattern to your other routes:

- ✅ **Officers** - Already done!
- ⏳ **Offices** - `src/routes/office.routes.ts`
- ⏳ **Meetings** - `src/routes/meeting.routes.ts`
- ⏳ **Attendance** - `src/routes/attendance.routes.ts`

## 💡 Tips

1. **Keep it updated**: Update docs when you change routes
2. **Use examples**: Add example values for better testing
3. **Group by tags**: Organize endpoints with tags
4. **Document schemas**: Define reusable schemas in components
5. **Test everything**: Use Swagger UI to catch issues early

## 🎨 Customization

The Swagger UI is configured in `src/configs/swagger.ts`. You can:

- Add more servers (staging, production)
- Customize security schemes
- Add global schemas
- Change API metadata

## 📦 Exporting

You can export the OpenAPI spec to:

- Share with frontend developers
- Generate client libraries
- Import into Postman
- Use with API testing tools

Just download from: `http://localhost:<PORT>/api-docs.json`

## 🤝 Benefits Over Postman Collections

1. **Auto-generated** from your code
2. **Always in sync** with your routes
3. **No manual maintenance** of collections
4. **Interactive** browser-based testing
5. **Easy sharing** via URL
6. **Type-safe** with TypeScript
