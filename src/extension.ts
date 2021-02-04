// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
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
}

// this method is called when your extension is deactivated
export function deactivate() {}
