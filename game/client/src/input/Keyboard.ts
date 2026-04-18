class Keyboard {
  private keys: Record<string, boolean> = {};

  init() {
    document.addEventListener("keydown", (key) => {
      this.keys[key.code] = true;
    });
    document.addEventListener("keyup", (key) => {
      this.keys[key.code] = false;
    });
  }

  isKeyDown(code: string) {
    return Boolean(this.keys[code]);
  }
}

export const keyboard = new Keyboard();
