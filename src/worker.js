// const { expose, isWorkerRuntime } = require('threads/worker');
// const path = require('path');
// const execPromise = require('util').promisify(require('child_process').exec);
// const logger = require('./logger');
// const util = require('util');
// const fs = require('fs');
// const readFile = util.promisify(fs.readFile);
// const writeFile = util.promisify(fs.writeFile);
// const mkdir = util.promisify(fs.mkdir);
// const stat = util.promisify(fs.stat);

import { EOL } from 'node:os';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat, mkdir } from 'node:fs/promises';
import pump from 'pump';
import split from 'split2';
import logger from './logger.js';

// This render only existing variables, keeping everything else
// eg .github ${{ secrets }} won't be replaced if the value is not provided
const render = (data, variables) =>
    Object.entries(variables).reduce((rendered, [varname, varvalue]) => {
        const result = rendered.replace(
            new RegExp(`{{ {0,}?${varname} {0,}?}}`, 'g'),
            varvalue
        );
        return result;
    }, data.toString());

const renderFilePath = (data, variables) =>
    Object.entries(variables).reduce((rendered, [varname, varvalue]) => {
        const result = rendered.replace(
            new RegExp(`\\[ {0,}?${varname}{0,}?\\]`, 'g'),
            varvalue
        );
        return result;
    }, data.toString());

export default async function Renderer({
    source,
    output,
    filepath,
    config,
    env,
}) {
    const st = await stat(filepath);
    if (st.isDirectory()) return;

    const outpath = path.resolve(
        output,
        path.relative(path.resolve(source), renderFilePath(filepath, env))
    );

    if (!config.dryRun) {
        try {
            await mkdir(path.dirname(outpath), { recursive: true });
        } catch (e) {
            logger.error(e);
        }
    }

    return new Promise((resolve, reject) => {
        if (config.dryRun) {
            logger.info('Writing %s', outpath);
            return resolve();
        }
        return pump(
            createReadStream(filepath),
            split((line) => {
                return render(line, env) + EOL;
            }),
            createWriteStream(outpath),
            (err) => (err ? reject(err) : resolve())
        );
    });
}
