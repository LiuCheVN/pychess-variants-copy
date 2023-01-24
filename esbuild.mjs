import * as esbuild from 'esbuild';
import NodeResolve from '@esbuild-plugins/node-resolve';
import { compress } from 'esbuild-plugin-compress';

const args = process.argv;
const dev = args.includes("dev");
const prod = args.includes("prod");
if (dev === prod)
    throw "There must be one and only one of either 'dev' or 'prod' in the arguments!";

const baseOpts = {
    entryPoints: ['./client/main.ts'],
    platform: 'browser',
    format: 'iife',
    bundle: true,
    outfile: './static/pychess-variants.js',
    plugins: [
        NodeResolve.default({
            mainFields: [ 'browser', 'module', 'main' ],
            extensions: [ ".js", ".ts" ],
        }),
    ],
};

if (dev) {
    await esbuild.build({
        ...baseOpts,
        sourcemap: 'inline',
    });
} else {
    await esbuild.build({
        ...baseOpts,
        minify: true,
        write: false,
        plugins: [
            ...baseOpts.plugins,
            compress(),
        ],
    });
}