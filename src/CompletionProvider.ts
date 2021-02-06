import { CancellationToken, Command, CompletionItem, CompletionItemKind, Position, TextDocument, TextEdit } from "vscode";
import * as vscode from 'vscode';

export class IntellisenseProvider implements vscode.CompletionItemProvider {
    public static readonly languageSelector: string[] = [ "javascript", "javascriptreact", "typescript", "typescriptreact", "html", "coffeescript" ];
    public static readonly triggerCharacters: string[] = [ "k:" ];
    private context: vscode.ExtensionContext | undefined;
    private readonly disposables: vscode.Disposable[] = [];
    private snippets:any[] = [];

     public addSnippets(s: any) {       
      this.snippets = JSON.parse(s);
    }

    public activate(context: vscode.ExtensionContext) {
    this.context = context;
    context.subscriptions.push(this);
    
    // create completion provider
    vscode.languages.registerCompletionItemProvider({pattern: "**/*"}, this);
    
  }

  public async provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken): Promise<CompletionItem[]> {
    let list: CompletionItem[] = [];

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
        const line = activeEditor.selection.active.line;
        console.log(document.getText(document.lineAt(position).range).replace(/k:/, ""));

    }

    this.snippets.forEach(item => list.push(createCompletionItem(item.name, CompletionItemKind.Function, { detail: "Kanlen function", insertText: item.snippet}))
);
    // this.snippets.forEach(item => list.push(createCompletionItem(item.name, CompletionItemKind.Function, { detail: "Kanlen function", textEdit: TextEdit.replace()})));

    

    return list;
  }
    
  public dispose() {
    // this.debug("dispose");
    this.disposables.forEach((item) => {
      try {
        item.dispose();
      } catch (err) {
        // this.debug("dispose", err);
      }
    });
  }

  public resolveCompletionItem?(item: CompletionItem, token: CancellationToken): CompletionItem | Thenable<CompletionItem> {
    // this.debug("resolveCompletionItem", item);
    return item;
  }
}

interface ExtraCompletionInfo {
  label?: string;
  kind?: CompletionItemKind;
  detail?: string;
  documentation?: string;
  sortText?: string;
  filterText?: string;
  insertText?: string;
  command?: Command;
  textEdit?: TextEdit;
  additionalTextEdits?: TextEdit;
}

function createCompletionItem(name: string, kind: CompletionItemKind, info: ExtraCompletionInfo): CompletionItem {
  const item = new CompletionItem(name, kind);
  Object.assign(item, info);
  return item;
}

