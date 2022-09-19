import { join } from "path";
import { readFileSync } from "fs";

export default class Util {
    static loadAsset(path: string): Buffer {
        const assetPath = join(process.cwd(), `/assets/${path}`);
        return readFileSync(assetPath);
    }
}
