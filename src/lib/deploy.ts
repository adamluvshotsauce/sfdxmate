"use strict";

import * as vscode from 'vscode';
import { Project } from './project';
import { Command } from './command';

/**
 * @description Deploy class for facilitating deployments to Salesforce orgs
 * 
 */
export class Deploy {

    public static async deployFile(textDocument: vscode.TextDocument) {
        const dirs = await Project.getPackageDirectories();
        console.log('dirs: ' + dirs);

        // run when the docuement is saved
        const fileName = textDocument.fileName;
        console.log('textDocument file name: ' + fileName);

        if ( dirs.some( dir => fileName.startsWith(dir))) {
            const deployCmd = Command.sourceDeploy(textDocument.fileName);
            Command.execute(deployCmd);
        }
    }
}