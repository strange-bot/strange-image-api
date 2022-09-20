import { join } from "path";
import { readFileSync } from "fs";

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
}
