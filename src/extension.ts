// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { languages } from './constants';
import { SidebarProvider } from './SidebarProvider';
import { Util } from './Util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  Util.globalState = context.globalState;
	
	
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"kanlen-sidebar",
			sidebarProvider
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("kanlen-vscode.getTextSelection", async () => {
     const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        vscode.window.showErrorMessage("I don't see any code");
        return;
      }
      let text = activeTextEditor.document.getText(activeTextEditor.selection);
			let snippetName;
			let token = Util.getToken();

      if (!text) {
        text = activeTextEditor.document.getText();
      }

      if (!text) {
        vscode.window.showErrorMessage(`I couldn't get any code`);
        return;
      }

			await vscode.window.showInputBox({
				placeHolder: "Name your snippet",
				prompt: "This will get saved to your Kanlen profile under the name you provide."
			}).then(input => snippetName = input)

			if (!snippetName) {
				return vscode.window.showErrorMessage("No name provided. Snippet not saved.")
			}
			sidebarProvider._view?.webview.postMessage({
				command: 'save-snippet',
				payload:{
					name: snippetName,
					snippet: text,
					token
				}
			});
			
    })
	);

	vscode.languages.registerCompletionItemProvider({
		language: "typescript",
		scheme: "untitled"
	}, {
	
	})
}

// this method is called when your extension is deactivated
export function deactivate() {}
