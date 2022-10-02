import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
    {
        user_id: { type: String, required: true },
        hostname: { type: String, required: true },
        ip: { type: String, required: true },
        method: { type: String, required: true },
        endpoint: { type: String, required: true },
        headers: { type: Object, required: true },
        query_params: { type: Object, required: true },
        rateLimit: {
            limit: { type: Number, required: true },
            current: { type: Number, required: true },
        },
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: "created_at",
            updatedAt: false,
        },
    }
);

const Log = mongoose.model("usage-logs", logSchema);

export default {
    add(data: object) {
        return new Log(data).save();
    },
};
