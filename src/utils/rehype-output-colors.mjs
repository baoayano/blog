// This plugin processes code blocks with the class "language-output" and applies color formatting based on custom markers in the text.
const namedColors = new Set([
    "red",
    "green",
    "yellow",
    "blue",
    "cyan",
    "purple",
    "gray",
    "orange"
]);

export default function rehypeOutputColors() {
    return (tree) => {
        walk(tree);
    };
}

function walk(node) {
  if (
    node.type === "element" &&
    node.tagName === "pre"
  ) {
    const code = node.children?.find(
      (child) =>
        child.type === "element" &&
        child.tagName === "code" &&
        hasClass(child, "language-output")
    );

    if (code) {
      node.properties ??= {};
      node.properties.className ??= [];

      if (!Array.isArray(node.properties.className)) {
        node.properties.className = [node.properties.className];
      }

      if (!node.properties.className.includes("astro-code")) {
        node.properties.className.push("astro-code");
      }
    }
  }

  if (
    node.type === "element" &&
    node.tagName === "code" &&
    hasClass(node, "language-output")
  ) {
    const raw = getText(node);

    node.children = parseOutput(raw);

    node.properties ??= {};
    node.properties.className ??= [];

    if (!Array.isArray(node.properties.className)) {
      node.properties.className = [node.properties.className];
    }

    node.properties.className.push("colored-output");
  }

  if (node.children) {
    for (const child of node.children) {
      walk(child);
    }
  }
}

function hasClass(node, className) {
    const classes = node.properties?.className;

    if (Array.isArray(classes)) {
        return classes.includes(className);
    }

    return classes === className;
}

function getText(node) {
    if (node.type === "text") {
        return node.value;
    }

    if (!node.children) {
        return "";
    }

    return node.children.map(getText).join("");
}

function parseOutput(text) {
    const result = [];

    // Mỗi dòng tự reset màu
    const lines = text.split("\n");

    lines.forEach((line, lineIndex) => {
        parseLine(line, result);

        if (lineIndex < lines.length - 1) {
            result.push({
                type: "text",
                value: "\n",
            });
        }
    });

    return result;
}

function parseLine(line, result) {
    // {red}
    // {green}
    // {#ff79c6}
    // {/}

    const markerRegex = /\{(\/|[a-zA-Z]+|#[0-9a-fA-F]{3,8})\}/g;

    let activeColor = null;
    let lastIndex = 0;

    let match;

    while ((match = markerRegex.exec(line)) !== null) {
        const before = line.slice(lastIndex, match.index);

        if (before) {
            pushText(result, before, activeColor);
        }

        const marker = match[1];

        if (marker === "/") {
            activeColor = null;
        } else if (isValidColor(marker)) {
            activeColor = marker;
        } else {
            // Marker không hợp lệ → giữ nguyên text
            pushText(result, match[0], activeColor);
        }

        lastIndex = markerRegex.lastIndex;
    }

    const rest = line.slice(lastIndex);

    if (rest) {
        pushText(result, rest, activeColor);
    }
}

function isValidColor(color) {
    if (namedColors.has(color)) {
        return true;
    }

    return /^#[0-9a-fA-F]{3,8}$/.test(color);
}

function pushText(result, text, color) {
    if (!color) {
        result.push({
            type: "text",
            value: text,
        });

        return;
    }

    // Custom HEX
    if (color.startsWith("#")) {
        result.push({
            type: "element",
            tagName: "span",
            properties: {
                className: ["output-custom"],
                style: `color:${color}`,
            },
            children: [
                {
                    type: "text",
                    value: text,
                },
            ],
        });

        return;
    }

    // Named color
    result.push({
        type: "element",
        tagName: "span",
        properties: {
            className: [`output-${color}`],
        },
        children: [
            {
                type: "text",
                value: text,
            },
        ],
    });
}