# WebAssembly

```
docker build -t webassembly .
```

```
docker run --mount src="$(pwd)",target=/code,type=bind -p 8080:8080 -it webassembly /bin/bash
```

```
cd /emsdk/ && source ./emsdk_env.sh
```

navigate to `src` folder:

```
cd /code/src/
```

and run:

```
emcc hello.c  -s WASM=1 -o hello.html
```

Run server:

```
python -m SimpleHTTPServer 8080
```

## Links

- https://mbebenita.github.io/WasmExplorer/
- https://webassembly.studio/
