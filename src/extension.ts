// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { IntellisenseProvider } from './CompletionProvider';
import { SidebarProvider } from './SidebarProvider';
import { Util } from './Util';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  Util.globalState = context.globalState;
	const snippets = Util.getSnippets();
	
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"kanlen-sidebar",
			sidebarProvider
		)
	);

	const provider = new IntellisenseProvider();
	provider.addSnippets(snippets);
  provider.activate(context);

	if (Util.getToken()) {
		vscode.commands.executeCommand('setContext', 'kanlen:isLoggedIn', true);
	}

	context.subscriptions.push(
		vscode.commands.registerCommand("kanlen-vscode.refreshSnippets", async () => {
			if (!Util.getToken()) {
			 return vscode.window.showErrorMessage("Please sign in to use that command")
		 }
			const token = Util.getToken()
			sidebarProvider._view?.webview.postMessage({
				command: "get-snippets",
				payload: {
					token
				}
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("kanlen-vscode.logout", async () => {
			if (!Util.getToken()) {
			 return vscode.window.showErrorMessage("Please sign in to use that command")
		 }
		 
			Util.globalState.update("token", null)
			sidebarProvider._view?.webview.postMessage({
				command: "logout"
			});
			vscode.commands.executeCommand('setContext', 'kanlen:isLoggedIn', false);

		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("kanlen-vscode.getTextSelection", async () => {
     const { activeTextEditor } = vscode.window;

		 if (!Util.getToken()) {
			 return vscode.window.showErrorMessage("Please sign in to use that command")
		 }

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
			}).then(input => snippetName = input);

			if (!snippetName) {
				return vscode.window.showErrorMessage("No name provided. Snippet not saved.");
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

	
}

// this method is called when your extension is deactivated
export function deactivate() {}
