#!/usr/bin/env node

import { parseArgs } from 'node:util';

import Main from '../src/index.js';
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
