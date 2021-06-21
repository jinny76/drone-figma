// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'export-preset') {
        debugger;
        traverse(figma.currentPage);
        figma.ui.postMessage(JSON.stringify(exportObj, null, 2));
    }
    else if (msg.type === 'cancel') {
        figma.closePlugin();
    }
};
let presets = [
    {
        id: "fillStyleId",
        properties: ["fills"]
    },
    {
        id: "strokeStyleId",
        properties: ["strokes", "strokeAlign", "strokeCap", "strokeJoin", "strokeMiterLimit", "strokeWeight"]
    }, {
        id: "effectStyleId",
        properties: ["effects"]
    }, {
        id: "textStyleId",
        properties: ["fontName", "fontSize", "letterSpacing", "lineHeight",
            "paragraphIndent", "paragraphSpacing", "textAlignHorizontal",
            "textAlignVertical", "textAutoResize", "textCase", "textDecoration"]
    },
];
let exportObj = {};
let keys = {};
function traverse(node) {
    console.log(node);
    presets.forEach(function (preset) {
        if (node[preset.id] != null && node[preset.id] != "") {
            keys[preset.id] = keys[preset.id] || {};
            if (keys[preset.id][node[preset.id]] == null) {
                keys[preset.id][node[preset.id]] = Object.keys(keys[preset.id]).length + 1;
            }
            let presetObj = {};
            preset.properties.map(prop => presetObj[prop] = node[prop]);
            exportObj[preset.id + keys[preset.id][node[preset.id]]] = presetObj;
        }
    });
    console.log(exportObj);
    if ("children" in node) {
        if (node.type !== "INSTANCE") {
            for (const child of node.children) {
                traverse(child);
            }
        }
    }
}
