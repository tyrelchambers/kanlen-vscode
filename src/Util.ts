import * as vscode from "vscode";

export class Util {
  static globalState: vscode.ExtensionContext["globalState"];

  static getToken() {
    return this.globalState.get<string>("token") || "";
  }

  static getUser() {
    return this.globalState.get<string>("user") || "";
  }

  static getSnippets() {
    return this.globalState.get<string>("snippets") || ""
  }

  static isLoggedIn() {
    return (
      !!this.globalState.get("token") 
    );
  }
}
