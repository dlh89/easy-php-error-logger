// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const errorLog = vscode.commands.registerCommand("extension.errorLog", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

		const document = editor.document;
    const selection = editor.selection;
    const selectedVar = document.getText(selection);
		const selectedLine = selection.active.line;
		const indentation = getIndentation(editor, document, selectedLine);
		
    // Check if the selected variable is not empty
    if (selectedVar.trim().length !== 0) {
      editor.edit(editBuilder => {
        editBuilder.insert(
          new vscode.Position(selectedLine + 1, 0),
					`${indentation}error_log('${selectedVar}:');\n`
				);
				editBuilder.insert(
          new vscode.Position(selectedLine + 1, 0),
					`${indentation}error_log(print_r(${selectedVar}, true));\n`
        );
			});
		}
	});
	
	context.subscriptions.push(errorLog);
}

function getIndentation(editor, document, selectedLine) {
	const selectedLineChars = document.lineAt(selectedLine).text.split('');
	let indentLevel = 0;
	let tabs = false;
	let indentation = '';

	if (selectedLineChars[0] === '\t') {
		tabs = true;
	}

	if (tabs) {
		for (const [i, char] of selectedLineChars.entries()) {
			// exit loop if not first index and not the same as previous char
			if (i !== 0 && selectedLineChars[i] !== selectedLineChars[i-1])
			{
				break;
			}
			if (char === "\t") {
				indentLevel++;
			}
		}

		indentation = '\t'.repeat(indentLevel)
	} else {
		for (const [i, char] of selectedLineChars.entries()) {
			// exit loop if not first index and not the same as previous char
			if (i !== 0 && selectedLineChars[i] !== selectedLineChars[i-1])
			{
				break;
			}
			if (char === ' ') {
				indentLevel++;
			}
		}
		
		indentation = ' '.repeat(indentLevel);
	}

	return indentation;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
