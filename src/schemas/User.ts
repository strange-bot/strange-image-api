import mongoose from "mongoose";
import Util from "../utils/Util";

interface IUser {
    _id: mongoose.Types.ObjectId;
    discord_id: string;
    username: string;
    token: string;
}

const userSchema = new mongoose.Schema(
    {
        discord_id: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        token: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: "created_at",
        },
    }
);

const User = mongoose.model("users", userSchema);
const cache = new Map<string, IUser>();

export default {
    async init() {
        await mongoose.connect(process.env.MONGO_URL as string);
        console.log("Connected to MongoDB");

        const users = await User.find().lean();
        for (const user of users) cache.set(user._id.toString(), user);

        console.log("Cached all users");
    },

    async createOrRegenerate(discordId: string, username: string): Promise<string> {
        await mongoose.connect(process.env.MONGO_URL as string);
        const token = Util.generateToken(discordId);

        let user = await User.findOne({ id: discordId });
        if (user) {
            user.token = token;
            await user.save();
        } else {
            user = new User({
                discord_id: discordId,
                username,
                token,
            });
            await user.save();
        }

        cache.set(user._id.toString(), user);
        const EncodedUserID = Buffer.from(user._id.toString()).toString("base64");
        return `${EncodedUserID}.${user.token}`;
    },

    get(userId: string): IUser | null {
        return cache.get(userId) ?? null;
    },

    getToken(discordId: string): string | null {
        const user = cache.get(discordId);
        if (!user) return null;
        const EncodedUserID = Buffer.from(user._id.toString()).toString("base64");
        return `${EncodedUserID}.${user.token}`;
    },
};
