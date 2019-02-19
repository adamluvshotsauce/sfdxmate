"use strict";

import { exec } from 'child_process';
import { Editor } from './editor';
import { Project } from './project';

/**
 * @description Command class for handling the construciton and execution of CLI commands 
 * 
 */
export class Command {

    public static sfdxForceCmd = 'sfdx force:';

    /* CONSTRUCTION METHODS */
    public static sourceCommand(): string {
        return this.sfdxForceCmd + 'source:';
    }

    public static sourceDeploy(filePath: string): string {
        return this.sourceCommand() + 'deploy -p ' + filePath;
    }

    /* EXECUTION METHODS */
    public static async execute(cmd: string) {
        const rootPath = await Project.getRootPath();
        // show the command executing
        Editor.showStatusInOutput(cmd);

        exec(
            `cd "${rootPath}" && ${cmd}`,
            (err, stdout, stderr) => {
                if (err) {
                    Editor.showOutput(stdout);

                } else {
                    Editor.showOutput(stdout, true);
                }
            }
        );
    }
}