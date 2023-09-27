export class MaxCheckInsError extends Error {
  constructor() {
    super("Max number of check-ins reached");
  }
}
