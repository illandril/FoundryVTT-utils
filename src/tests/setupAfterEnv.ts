import failOnConsole from 'jest-fail-on-console';
import './setup/game';
import './setup/Hooks';

failOnConsole({
  shouldFailOnAssert: true,
  shouldFailOnError: true,
  shouldFailOnWarn: true,
  shouldFailOnLog: true,
});
