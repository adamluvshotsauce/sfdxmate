"use strict";

import * as vscode from 'vscode';
import { SfdxProject }  from '@salesforce/core';


/**
 * @description Project class for hanlding interations with the project configuration
 * 
 */
export class Project {

    public static async getRootPath(): Promise<any> {
        return vscode.workspace.workspaceFolders 
                ? vscode.workspace.workspaceFolders[0].uri.fsPath + '/'
                    : undefined;
    }

    public static async getProjectJson(): Promise<any> {
        const rootPath = await this.getRootPath();
        return rootPath
                ? await SfdxProject.resolve(rootPath)
                    : undefined;
    }

    public static async getProjectConfig(): Promise<any> {
        const projectJson = await this.getProjectJson();
        return await projectJson.resolveProjectConfig();
    }

    public static async getPackageDirectories(): Promise<string[]> {
        const projectConfig = await this.getProjectConfig();
        const dirs: string[] = [];

        if ( projectConfig ) {
            const rootPath           = await this.getRootPath();
            const packageDirectories = await projectConfig.packageDirectories;
    
            packageDirectories.forEach((dir: { [path: string]: string; }) => {
                dirs.push(rootPath + dir.path);
            });
        }
        return dirs;
    }
}