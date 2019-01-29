"use strict";

import { window, OutputChannel } from 'vscode';
import * as moment from 'moment';

/** 
 * @description Editor class for handling interactions with the VSCode editor 
 * 
 */
export class Editor {

    public static outputChannel: OutputChannel = window.createOutputChannel('SFDX Mate');

    public static showOutput(outputMsg: string, hide?: boolean) {
        this.outputChannel.appendLine(outputMsg);
        this.outputChannel.show(true);

        if (hide) {
            setTimeout( () => this.outputChannel.hide(), 1500 );
        }
    }

    public static showStatusInOutput(status: string) {
        this.showOutput('[STATUS]   SFDX Mate: Running...');
        this.showOutput('[' + moment().format('LTS') + '] ' + status);
        this.showOutput('');
    } 
}