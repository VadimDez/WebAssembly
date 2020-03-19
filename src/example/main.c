#define WASM_EXPORT __attribute__((visibility("default")))

WASM_EXPORT
int main(int number) {
  unsigned int a = 0;
  for (int i = 0; i < number; i++) {
    a++;
  }
  return a;
}
