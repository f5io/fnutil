import * as core from './core';
import * as decorators from './decorators';
import utils from './utils';
export default {
  core,
  decorators,
  utils,
  ...core,
  ...utils
};
