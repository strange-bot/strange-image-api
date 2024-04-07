## Description

Strange API was built to provide Discord bot developers an easy way to get content from the internet. It provides an easy to use interface and takes hard tasks away from developers.

## Quick Links:

-   **[Home Page](https://strangeapi.hostz.me)**
-   **[API Documentation](https://strangeapi.hostz.me/docs)**
-   **[Discord Server](https://discord.gg/jAQg6xs8vu)**

## Authentication

> [!NOTE]
> If you don't have the token required to access this API, you can get one for free at **[the dashboard](#quick-links)** or by joining our **[Discord server](#quick-links)** and using the `/apikey generate` command.

When calling our API, you must provide a HTTP-Header with name `Authorization` and value `Bearer TOKEN` where you replace 'TOKEN' with your token.

Remember that you can also pass the authorization directly by adding a query to the endpoint url like `?apiKey=TOKEN` where you replace `TOKEN` with your token.

## Example requesting to image api using [superagent](https://github.com/ladjs/superagent)

```javascript
const request = require("superagent");

request
    .get("https://strangeapi.hostz.me/api/generators/beautiful") // the endpoint
    .set("Authorization", "Bearer YourTokenHere") // authentication
    .query({ image: "" }) // the image to be used in the meme (Also work with query parameter above).
    .then((res) => res.body); // handle the buffer response
```

> [!NOTE] > **Note:** The most of API request response is a Buffer (for image), handle the buffer somehow with your programming language.

## Client Libraries

| Language   | Library                                                          | Author                                                |
| ---------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| Typescript | [strange.js](https://www.npmjs.com/package/strange.js)           | [Ghellab Abderrahmane](https://github.com/rhaym-tech) |
| Typescript | [strange-api-wrapper](https://www.npmjs.com/package/strange.api) | [Zastinian](https://zastinian.com/)                   |

## Self-hosting

1. Clone the repository
2. Install dependencies
3. Copy `.env.example` to `.env` and fill in your environment variables
4. Build the project with `npm run build` or `yarn build`
5. Start the server with `npm start` or `yarn start`

```bash
git clone https://github.com/saiteja-madha/strange-image-api.git
cd strange-image-api
npm install # or yarn
cp .env.example .env
npm run build
npm start
```

## Contributing

Contributions are welcome. Please open a pull request with your changes.

## Credits

Special thanks to [SharifPoetra](https://github.com/SharifPoetra/) for sharing his ideas and major ideas were taken from his [project](https://github.com/Emilia-API).
