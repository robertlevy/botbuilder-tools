import * as os from 'os';
import * as process from 'process';
import * as path from 'path';
import * as program from 'commander';
import * as chalk from 'chalk';
import { BotConfig, ServiceType } from './BotConfig';
import { IBotConfig } from './schema';
import { Enumerable, List, Dictionary } from 'linq-collections';

program.Command.prototype.unknownOption = function (flag: any) {
    console.error(chalk.default.redBright(`Unknown arguments: ${flag}`));
    program.help();
};

interface ListArgs {
    bot: string;
    secret: string;
}

program
    .name("msbot list")
    .option('-b, --bot <path>', "path to bot file.  If omitted, local folder will look for a .bot file")
    .option('--secret <secret>', 'bot file secret password for encrypting service secrets')
    .action((cmd, actions) => {
    });

let parsed = <ListArgs><any>program.parse(process.argv);

if (!parsed.bot) {
    BotConfig.LoadBotFromFolder(process.cwd(), parsed.secret)
        .then(processListArgs)
        .catch((reason) => {
            console.error(chalk.default.redBright(reason.toString().split("\n")[0]));
            program.help();
        });
} else {
    BotConfig.Load(parsed.bot, parsed.secret)
        .then(processListArgs)
        .catch((reason) => {
            console.error(chalk.default.redBright(reason.toString().split("\n")[0]));
            program.help();
        });
}


async function processListArgs(config: BotConfig): Promise<BotConfig> {
    let services = config.services;

    console.log(JSON.stringify(<IBotConfig>{
        name: config.name,
        description: config.description,
        services: config.services
    }, null, 4));
    return config;
}