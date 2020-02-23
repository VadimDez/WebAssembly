# WebAssembly

WebAssembly tutorial

### Step-by-step guide

#### Build Docker

```
docker build -t webassembly .
```

#### Run shell

In the root folder of the project run:

```
docker run --mount src="$(pwd)",target=/code,type=bind -p 8080:8080 -it webassembly /bin/bash
```

#### Source emsdk

```
cd /emsdk/ && source ./emsdk_env.sh
```

#### Compile C code to WASM

1. navigate to `src` folder:

```
cd /code/src/
```

2. and run:

```
emcc hello.c  -s WASM=1 -o hello.html
```

### Run server and see the result
run in the root folder
```
npm run start
```

And then open [http://localhost/hello.html](http://localhost/hello.html)

## Links

- https://mbebenita.github.io/WasmExplorer/
- https://webassembly.studio/
- https://wapm.io/

## License

[MIT](https://tldrlegal.com/license/mit-license) © [Vadym Yatsyuk](https://github.com/vadimdez)
