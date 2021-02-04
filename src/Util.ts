import * as vscode from "vscode";

export class Util {
  static globalState: vscode.ExtensionContext["globalState"];

  static getToken() {
    return this.globalState.get<string>("token") || "";
  }

  static getUser() {
    return this.globalState.get<string>("user") || "";
  }


  static isLoggedIn() {
    return (
      !!this.globalState.get("token") 
    );
  }
}
