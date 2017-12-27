call tsc --target es5 --sourceMap --lib es5,es6,dom --moduleResolution node --types node --experimentalDecorators --emitDecoratorMetadata --module commonjs --typeRoots node_modules/@types %1
node %~pn1.js
