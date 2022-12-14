import failOnConsole from 'jest-fail-on-console';
import './setup/game';
import './setup/Hooks';
import './setup/Templates';

Math.clamped = (num, min, max) => Math.min(max, Math.max(num, min));

failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnError: true,
  shouldFailOnWarn: true,
  shouldFailOnLog: true,
});
