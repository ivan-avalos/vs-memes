"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const axios_1 = require("axios");
var interval;
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('vs-memes.start', () => {
        startMemes();
    }), vscode.commands.registerCommand('vs-memes.stop', () => {
        stopMemes();
    }));
}
exports.activate = activate;
function startMemes() {
    const ms = 5 * 60 * 1000;
    interval = setInterval(() => {
        const panel = vscode.window.createWebviewPanel('vsmeme', 'Random Meme', vscode.ViewColumn.One, {});
        fetchRandomMeme(panel);
    }, ms);
}
function stopMemes() {
    if (interval) {
        clearTimeout(interval);
    }
}
function fetchRandomMeme(panel) {
    const url = "https://meme-api.herokuapp.com/";
    const subreddit = "ProgrammerHumor";
    axios_1.default.get(url + 'gimme/' + subreddit).then((response) => {
        panel.title = response.data.title;
        panel.webview.html = `
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>` + response.data.title + `</title>
            </head>
            <body>
                <h1>What time is it? Meme time!</h1>
                <p>Here is your fresh random programming meme from <a href="https://reddit.com/r/` + subreddit + `">r/` + subreddit + `</a>. Click the image to go to the post.</p>
                <h2>` + response.data.title + `</h2>
                <a href="` + response.data.postLink + `"><img src="` + response.data.url + `" width="100%" /></a>
            </body>
            </html>
        `;
    });
}
//# sourceMappingURL=extension.js.map