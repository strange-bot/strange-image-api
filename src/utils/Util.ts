import { join } from "path";
import { readFileSync } from "fs";
import crypto from "crypto";

export default class Util {
    static loadAsset(path: string): Buffer {
        const assetPath = join(process.cwd(), `/assets/${path}`);
        return readFileSync(assetPath);
    }

    static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static generateToken(data: string = ""): string {
        const HMAC = crypto.createHmac("SHA256", crypto.randomBytes(32));
        HMAC.update(`${Date.now()}:${data}:${Date.now()}`);
        return HMAC.digest("base64").replace(new RegExp("=", "g"), "").replace(new RegExp("/", "g"), "").replace(new RegExp("[+]", "g"), "");
    }
}
