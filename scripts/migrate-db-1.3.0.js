require("dotenv").config();
const mongoose = require("mongoose");

async function migration() {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL, { keepAlive: true });
    console.log("🔌 Database connection established");

    // Get all collections
    const collections = await mongoose.connection.db.collections();
    try {
        const usageLogs = collections.find((c) => c.collectionName === "usage-logs");
        if (!usageLogs) {
            return console.log("🔎 Usage logs collection not found");
        }

        await usageLogs.updateMany({}, [
            {
                $set: {
                    httpVersion: "1.1",
                    "res.statusCode": 200,
                    "res.time": -1,
                    "res.headers.content-length": -1,
                    "res.headers.content-type": "image/png",
                    "res.headers.x-ratelimit-limit": "$rateLimit.current",
                    "res.headers.x-ratelimit-remaining": {
                        $subtract: [5, "$rateLimit.current"],
                    },
                },
            },
            {
                $unset: "rateLimit",
            },
        ]);

        console.log("🔧 Usage logs collection updated");
    } catch (ex) {
        console.log(ex);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log("🔌 Database connection closed");
    }
}

migration();
