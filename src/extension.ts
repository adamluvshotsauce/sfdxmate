"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Config } from './lib/config';
import { Deploy } from './lib/deploy';
import { Editor } from './lib/editor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "sfdxmate" is now active!');

	// Display a message box to the user
    Editor.showOutput('[STATUS]   SFDX Mate: Activating...');
    
    /* Show Default Username */
	let showDefaultUsername = vscode.commands.registerCommand('show.username', async () => {

		const username = await Config.getDefaultUsername();
		vscode.window.showInformationMessage(`Default Username: ${username}`);
	});
	context.subscriptions.push(showDefaultUsername);

    /* Show Default Dev Hub */
	let showDefaultDevHub = vscode.commands.registerCommand('show.devhub', async() => {

		const devHub = await Config.getDefaultDevHub();
		vscode.window.showInformationMessage(`Default Dev Hub: ${devHub}`);
	});
	context.subscriptions.push(showDefaultDevHub);

    /* Change Default Username */
	let changeDefaultUsername = vscode.commands.registerCommand('change.defaultorg', async() => {
        const orgs = await Config.getOrgsList();

        let pickerOpts: vscode.QuickPickItem[] = [];

        orgs.forEach(org => {
            pickerOpts.push(
                {
                    label: org.alias,
                    detail: 'Username: ' + org.username
                }
            );
        });
        
        vscode.window.showQuickPick(pickerOpts, {placeHolder: 'Please pick a new default username.'})
            .then( async (selection) => {
                if ( selection ) {
                    await Config.changeDefaultUsername(selection!.label);
                }
                return selection;
            })
            .then( async (selection) => {
                if ( selection ) {
                    const alias = await Config.getDefaultUsername();
    
                    if ( selection.label === alias ) {
                        vscode.window.showInformationMessage(
                            `Changed Default Username to: ${alias}`
                        );
                    }
                }
            }); 
	});
	context.subscriptions.push(changeDefaultUsername);

	/* On Save Deploy */
	vscode.workspace.onDidSaveTextDocument(textDocument => {
		Deploy.deployFile(textDocument);
	});

	// welcome the user and update status
	Editor.showOutput('[STATUS]   SFDX Mate: Initialized');
	Editor.showOutput('', true);
	vscode.window.showInformationMessage('Hello from SFDX Mate!');
}

// this method is called when your extension is deactivated
export function deactivate() {}
