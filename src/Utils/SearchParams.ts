export default class extends URLSearchParams {
  constructor() {
    super();
  }

  append(name: string, value: string): this {
    super.append(name, value);
    return this;
  }
}
