import { performance } from 'node:perf_hooks';
import { parseArgs, promisify } from 'node:util';
import path from 'path';
import { Piscina } from 'piscina';
import glob from 'fast-glob';
import rimraf from 'rimraf';

import logger from '../src/logger.js';

const { values: processArgs } = parseArgs({
    options: {
        source: {
            type: 'string',
            short: 's',
        },
        output: {
            type: 'string',
            short: 'o',
        },
        verbose: {
            type: 'boolean',
            default: false,
        },
        dryRun: {
            type: 'boolean',
            short: 'd',
            default: false,
        },
        ignore: {
            type: 'string',
            short: 'i',
            multiple: true,
        },
    },
});

function launchPool(source, output, filepaths, config, env) {
    const pool = new Piscina({
        // The URL must be a file:// URL
        filename: new URL('../src/worker.js', import.meta.url).href,
    });

    return Promise.all(
        filepaths.map((filepath) =>
            pool.run({
                source,
                output,
                filepath,
                config,
                env,
            })
        )
    );
}

async function Main(config = {}, env) {
    const startTime = performance.now();

    if (!config.dryRun) {
        await promisify(rimraf)(config.output);
    }

    const filepaths = await glob(`${path.resolve(config.source)}/**/*`, {
        dot: true,
        onlyFiles: true,
        ignore: ['**/node_modules/**', '**/.git/**'].concat(
            processArgs.ignore || []
        ),
    });

    if (
        config.output === '~' ||
        config.output === '/' ||
        config.output === '$HOME' ||
        config.output === process.env.HOME
    ) {
        logger.warn(
            'WHAT ARE YOU DOING? Watch out for the output dir, this can be destructive'
        );
        process.exit(0);
    }

    if (!filepaths.length) {
        throw new Error("Source path empty or doesn't exists.");
    }

    // wait for all threads to finish work before exiting
    await launchPool(config.source, config.output, filepaths, config, env);

    logger.info(
        `Done in ${(performance.now() - startTime).toFixed(
            2
        )}ms, now go create something!`
    );
}

try {
    if (!processArgs.source) {
        throw new Error('No source directory provided, -s or --source');
    }

    if (!processArgs.output) {
        throw new Error('No output folder provided, --output or -o ');
    }

    process.env.IS_DRY = processArgs.dryRun;
    await Main(processArgs, { ...process.env });
    process.exit(0);
} catch (error) {
    if (processArgs.verbose) {
        logger.error(error);
    } else {
        logger.error(error.message);
    }
    process.exit(1);
}
