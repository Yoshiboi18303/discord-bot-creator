#! /usr/bin/env node

// MIT License

// Copyright (c) 2023 Yoshiboi18303

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const inquirer = require("inquirer");
const colors = require("cli-color");
const clui = require("clui");
const fsPromises = require("fs/promises");
const fs = require("fs");
const package = require("../package.json");
const exec = require("util").promisify(require("child_process").exec);

/**
 * @param {String} file
 */
const logDeleteMessage = (file) => {
    console.log("🗑️" + colors.red("DELETE ") + file);
};

/**
 * @param {String} file
 */
const logCreateMessage = (file) => {
    console.log("📝 " + colors.green("CREATE ") + file);
};

/**
 * @param {String} info
 */
const logSuccessMessage = (info) => {
    console.log("✅ " + colors.green(info));
};

/**
 * @param {String} info
 * @param {Boolean} exit
 */
const logErrorMessage = (info, exit = true) => {
    console.log("❌ " + colors.red(info));
    if (exit) process.exit(1);
};

(async () => {
    /**
     * @type {Object<string, string | Array<string>}
     */
    const props = await inquirer.prompt([
        {
            type: "list",
            name: "wrapper",
            message: "Which Discord API wrapper do you want to use?",
            choices: [
                {
                    name: "Discord.js",
                    value: "discordjs",
                },
                {
                    name: "Eris",
                    value: "eris",
                },
            ],
        },
        {
            type: "input",
            name: "name",
            message: "Please enter your project name:",
        },
        {
            type: "checkbox",
            name: "features",
            message:
                "Please select which features you would like your Discord bot project to have.",
            choices: [
                {
                    name: "Command Handler",
                    value: "commandHandler",
                    short: "commandHandler",
                },
                {
                    name: "Event Handler",
                    value: "eventHandler",
                    short: "eventHandler",
                },
                {
                    name: "Website",
                    value: "website",
                    short: "website",
                },
                {
                    name: "Voice Support",
                    value: "voice",
                    short: "voice",
                },
            ],
        },
    ]);

    const appDataFolder =
        process.env.APPDATA ||
        (process.platform == "darwin"
            ? process.env.HOME + "/Library/Preferences"
            : process.env.HOME + "/.local/share");
    const BASE_TEMPLATE_PATH = `${appDataFolder}/npm/node_modules/${package.name}/templates/js`;
    let templatePath = `${BASE_TEMPLATE_PATH}/${props.wrapper}`;
    let copyToPath = `${process.cwd()}\\${props.name}`;

    if (
        props.features.includes("commandHandler") &&
        props.features.includes("eventHandler")
    )
        templatePath += "/withCommandHandlerAndEventHandler";
    else if (
        props.features.includes("commandHandler") &&
        !props.features.includes("eventHandler")
    )
        templatePath += "/withCommandHandler";
    else if (
        !props.features.includes("commandHandler") &&
        props.features.includes("eventHandler")
    )
        templatePath += "/withEventHandler";
    else templatePath += "/withNone";

    if (fs.existsSync(copyToPath)) {
        const overwriteDirectory = (
            await inquirer.prompt([
                {
                    type: "confirm",
                    name: "overwriteDirectory",
                    message: `The directory "${copyToPath}" already exists, would you like to overwrite it?`,
                    default: false,
                },
            ])
        ).overwriteDirectory;

        if (overwriteDirectory) {
            await fsPromises.rmdir(copyToPath).catch(() => {
                logErrorMessage("Couldn't delete directory, exiting...");
            });

            logDeleteMessage(props.name);
        } else {
            let itemNumber = 0;

            for (const item of fs.readdirSync(process.cwd())) {
                if (item === props.name) itemNumber += 1;
            }

            copyToPath += ` (${itemNumber})`;

            console.log(
                colors.blue(`ℹ️ Using ${copyToPath} as directory path now...`)
            );
        }
    }
    await fsPromises.mkdir(props.name).catch(() => {
        logErrorMessage("Couldn't create project, exiting...", true);
    });

    // Copy all files from the template to the project (including subdirectories and file).
    await fsPromises.cp(templatePath, copyToPath, {
        recursive: true,
    });

    logSuccessMessage("Project template copied!");

    if (props.features.includes("voice") && props.wrapper === "discordjs") {
        const project = JSON.parse(
            fs.readFileSync(`${copyToPath}/package.json`).toString()
        );

        project["dependencies"]["@discordjs/voice"] = "0.14.0";
        project["dependencies"]["@discordjs/opus"] = "0.9.0";

        await fsPromises.writeFile(
            `${copyToPath}/package.json`,
            JSON.stringify(project, undefined, 4)
        );
    }

    if (props.features.includes("website")) {
        const project = JSON.parse(
            fs.readFileSync(`${copyToPath}/package.json`).toString()
        );

        project["dependencies"]["express"] = "4.18.2";

        await fsPromises.writeFile(
            `${copyToPath}/package.json`,
            JSON.stringify(project, undefined, 4)
        );

        await fsPromises.mkdir(`${copyToPath}/website`);
        for (const file of fs.readdirSync(`${BASE_TEMPLATE_PATH}/website`)) {
            await fsPromises.copyFile(
                `${BASE_TEMPLATE_PATH}/website/${file}`,
                `${props.name}/website/${file}`
            );

            logCreateMessage(`website/${file}`);
        }
    }

    const installDependencies = (
        await inquirer.prompt([
            {
                type: "confirm",
                name: "installDependencies",
                message:
                    "Would you like to install the NPM dependencies? (recommended)",
                default: true,
            },
        ])
    ).installDependencies;

    const installingSpinner = new clui.Spinner("Installing dependencies...");

    let time = 0;

    if (installDependencies) {
        installingSpinner.start();
        let dependenciesInstalled = false;

        setInterval(() => {
            if (dependenciesInstalled) return;
            time += 1;
            if (time >= 10)
                installingSpinner.message(
                    `Installing dependencies... ${time}s`
                );
        }, 1000);

        if (!props.features.includes("voice") && props.wrapper === "eris")
            await exec(`cd ${copyToPath} && npm install --no-optional`);
        else await exec(`cd ${copyToPath} && npm install`);

        dependenciesInstalled = true;

        installingSpinner.stop();

        logSuccessMessage(`Dependencies installed (${time} seconds elapsed)!`);
    } else {
        console.log(
            colors.blue(
                "ℹ That's all good! You can run `npm install` at any time within your project!"
            )
        );
    }

    const createGitRepository = (
        await inquirer.prompt([
            {
                type: "confirm",
                name: "createGitRepository",
                message:
                    "Would you like to create a Git repository? (optional)",
                default: false,
            },
        ])
    ).createGitRepository;

    if (createGitRepository) {
        installingSpinner.message("Creating Git Repository...");
        let repositoryReady = false;

        installingSpinner.start();

        time = 0;

        setInterval(() => {
            if (repositoryReady) return;
            time += 1;
            if (time >= 10)
                installingSpinner.message(
                    `Creating Git Repository... ${time}s`
                );
        }, 1000);

        await exec(`cd ${copyToPath} && git init`);

        repositoryReady = true;

        installingSpinner.stop();

        logSuccessMessage("Git repository created!");
    } else {
        console.log(
            colors.blue(
                "ℹ️ That's all good!\n\nYou can run `git init` at any time within your project!"
            )
        );
    }

    logSuccessMessage(
        `Project created at "${copyToPath}"!\n\nStart by running "cd ./${props.name}" then run "npm start"!\nHope you enjoying creating your project with this command-line app!`
    );

    process.exit();
})();
