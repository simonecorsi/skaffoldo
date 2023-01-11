import { EOL } from 'node:os';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { stat, mkdir } from 'node:fs/promises';
import pump from 'pump';
import split from 'split2';

import logger from './logger.js';
import { render } from './utils.js';

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
        path.relative(path.resolve(source), render(filepath, env, '\\[', '\\]'))
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
