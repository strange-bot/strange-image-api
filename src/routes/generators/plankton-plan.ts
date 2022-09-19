import { Request, Response } from "express";
import { createCanvas, loadImage, registerFont } from "canvas";
import CanvasUtil from "../../utils/CanvasUtil";
import ResponseUtil from "../../utils/ResponseUtil";
import Util from "../../utils/Util";

registerFont(`${process.cwd()}/assets/fonts/Noto-Regular.ttf`, { family: "Noto" });
registerFont(`${process.cwd()}/assets/fonts/Noto-CJK.otf`, { family: "Noto" });
registerFont(`${process.cwd()}/assets/fonts/Noto-Emoji.ttf`, { family: "Noto" });
const coord = [
    [240, 63],
    [689, 63],
    [705, 383],
    [220, 380],
];

/**
 * @swagger
 * /generators/plankton-plan:
 *   get:
 *     summary: Sends a Plankton's Plan meme with steps of your choice
 *     tags: [Generators]
 *     parameters:
 *       - in: query
 *         name: firstStep
 *         description: The first step of the plan
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: secondStep
 *         description: The seconds step of the plan
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: thirdStep
 *         description: The third step of the plan
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: fourthStep
 *         description: The fourth step of the plan
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The buffer containing the image data
 *         image/png:
 *           schema:
 *             type: binary
 */

export default async (req: Request, res: Response): Promise<any> => {
    try {
        const { firstStep, secondStep, thirdStep, fourthStep } = req.query;
        if (!firstStep || !secondStep || !thirdStep || !fourthStep) {
            return ResponseUtil.missingParams(res, "firstStep", "secondStep", "thirdStep", "fourthStep");
        }

        const steps = [firstStep, secondStep, thirdStep, fourthStep];

        const template = await loadImage(Util.loadAsset("generators/plankton-plan.png"));
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(template, 0, 0);
        ctx.fillStyle = "black";
        ctx.textBaseline = "top";
        let i = 0;
        for (const [x, y] of coord) {
            ctx.font = "35px Noto";
            const step = steps[i];
            let fontSize = 35;
            while (ctx.measureText(step as string).width > 420) {
                fontSize -= 1;
                ctx.font = `${fontSize}px Noto`;
            }
            const lines = await CanvasUtil.wrapText(ctx, step as string, 155);
            ctx.fillText(lines!.join("\n"), x, y);
            i++;
        }
        const buffer = canvas.toBuffer();

        return ResponseUtil.success(res, buffer);
    } catch (ex) {
        return ResponseUtil.serverError(res, ex as Error);
    }
};
