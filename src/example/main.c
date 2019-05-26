#define WASM_EXPORT __attribute__((visibility("default")))

WASM_EXPORT
int main() {
  int a = 0;
  for (int i = 0; i < 10000000; i++) {
    a++;
  }
  return a;
}
