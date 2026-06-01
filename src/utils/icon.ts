// src/utils/icons.ts
import { iconToSVG, replaceIDs } from "@iconify/utils";
import icons from "@iconify-json/mdi/icons.json";

const copyIcon = icons.icons["content-copy"];

export function getCopyIconSvg() {
    const { body, attributes } = iconToSVG(copyIcon, {
        width: "20px",
        height: "20px",
    });

    return replaceIDs(`
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="${attributes.width}"
            height="${attributes.height}"
            class="dark:text-[#fff] text-[#333] hover:text-[#ba394b] active:text-[#2b2b2b] transition-transform"
        >
            ${body}
        </svg>
    `);
}