# WebAssembly

WebAssembly tutorial

Step-by-step guide

#### Build Docker

```
docker build -t webassembly .
```

#### Run shell

```
docker run --mount src="$(pwd)",target=/code,type=bind -p 8080:8080 -it webassembly /bin/bash
```

#### Source emsdk

```
cd /emsdk/ && source ./emsdk_env.sh
```

#### Compile C code to WASM

navigate to `src` folder:

```
cd /code/src/
```

and run:

```
emcc hello.c  -s WASM=1 -o hello.html
```

### Run server and see the result

```
python -m SimpleHTTPServer 8080
```

And then open [http://localhost/hello.html](http://localhost/hello.html)

## Links

- https://mbebenita.github.io/WasmExplorer/
- https://webassembly.studio/
