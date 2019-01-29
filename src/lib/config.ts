"use strict";

import * as sfcore from "@salesforce/core";
import { Project } from './project';

/** 
 * @description Config class for handling interations with the SFDX config settings 
 * 
 */
export class Config {

    private static dot_sfdx_dir = '.sfdx/';

    public static async getOrgsList(): Promise<Array<{alias: string, username: string}>> {
        const orgs : Array<{alias: string, username: string}> = [];
        // returns a list of username auth files
        const authFiles = await sfcore.AuthInfo.listAllAuthFiles();
        
        const usernames = authFiles.map(authfile => authfile.replace('.json', ''));

        const aliases = await sfcore.Aliases.create(sfcore.Aliases.getDefaultOptions());

        // Map the aliases onto the usernames
        for (const username of usernames) {
            let alias = aliases.getKeysByValue(username)[0];

            if (alias) {
                orgs.push({ 
                    alias: alias, 
                    username : username
                });
            }
        }

        return orgs;
    }

    public static async getDefaultUsername(): Promise<string> {
        const defaultKey = 'defaultusername';
        return await this.getDefaultUsernames(defaultKey);
    }
    
    public static async getDefaultDevHub(): Promise<string> {
        const defaultKey = 'defaultdevhubusername';
        return await this.getDefaultUsernames(defaultKey);
    }

    public static async getDefaultUsernames(defaultKey?: string): Promise<any> {
        const rootPath = await Project.getRootPath();

        if (rootPath) {

            const defaultUsernames = await sfcore.fs.readJsonMap(rootPath + this.dot_sfdx_dir + sfcore.Config.getFileName());

            return defaultKey ? defaultUsernames[defaultKey] : defaultUsernames;

        } else {
            return undefined;
        }
    }

    public static async changeDefaultUsername(newDefault: string): Promise<any> {

        const rootPath  = await Project.getRootPath(); 
        const localPath = rootPath + this.dot_sfdx_dir + sfcore.Config.getFileName();

        const localConfig = await sfcore.fs.readJsonMap(localPath);

        localConfig.defaultusername = newDefault;

        await sfcore.fs.writeJson(localPath, localConfig);
    }
}