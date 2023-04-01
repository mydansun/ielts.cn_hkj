import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['ielts.js'],
    bundle: true,
    minify: true,
    target: [
        'es2016'
    ],
    outfile: 'dist/ielts.min.js',
});