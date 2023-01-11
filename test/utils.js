import assert from 'node:assert';
import test from 'node:test';
import { render } from '../src/utils.js';

test('Render variables in string', async (t) => {
    await t.test(
        'Should render variables within default delimiters "{{ }}"',
        () => {
            const out = render('Hello {{ MyVariables }}!', {
                MyVariables: 'World',
            });

            assert.equal(out, 'Hello World!');
        }
    );

    await t.test(
        'Should render variables within custom delimiter "[ ]"',
        () => {
            const out = render(
                '[filename].js',
                {
                    filename: 'ajeje',
                },
                '\\[',
                '\\]'
            );

            assert.equal(out, 'ajeje.js');
        }
    );
});
