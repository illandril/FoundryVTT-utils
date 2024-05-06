import failOnConsole from 'jest-fail-on-console';
import './setup/foundry';
import './setup/game';
import './setup/Hooks';
import './setup/Templates';
import './setup/ui';

Math.clamped = (num, min, max) => Math.min(max, Math.max(num, min));

String.prototype.titleCase = function (this: string): string {
  if (!this.length) {
    return this;
  }
  return this.toLowerCase()
    .split(' ')
    .reduce((parts, word) => {
      if (!word) {
        return parts;
      }
      const title = word.replace(word[0], word[0].toUpperCase());
      parts.push(title);
      return parts;
    }, [] as string[])
    .join(' ');
};

String.prototype.capitalize = function (this: string): string {
  if (!this.length) {
    return this;
  }
  return this.charAt(0).toUpperCase() + this.slice(1);
};

failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnError: true,
  shouldFailOnWarn: true,
  shouldFailOnLog: true,
});

declare global {
  interface Simulate {
    _: number;
  }
  const SIMULATE: Simulate;
}
