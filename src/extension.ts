/*
 * Visual Studio Code Memes
 * Copyright (C) 2019  Iván Ávalos <ivan.avalos.diaz@hotmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as vscode from 'vscode';
import axios from 'axios';

var interval: NodeJS.Timeout;

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('vs-memes.start', () => {
            startMemes ();
        }),
        vscode.commands.registerCommand('vs-memes.show', () => {
            showMeme ();
        }),
        vscode.commands.registerCommand('vs-memes.stop', () => {
            stopMemes ();
        })
    );
}

function startMemes () {
    const ms = 5 * 60 * 1000;
    interval = setInterval(() => {
        showMeme();
    }, ms);
}

function stopMemes () {
    if (interval) {
        clearTimeout(interval);
    }
}

function showMeme () {
    const panel = vscode.window.createWebviewPanel(
        'vsmeme',
        'Random Meme',
        vscode.ViewColumn.One,
        {}
    );
    fetchRandomMeme (panel);
}

function fetchRandomMeme (panel: vscode.WebviewPanel) {
    const url = "https://meme-api.herokuapp.com/"
    const subreddit = "ProgrammerHumor"
    axios.get(url + 'gimme/' + subreddit).then((response) => {
        panel.title = response.data.title
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
        `
    });
}