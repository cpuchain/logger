import { factory } from './index';

const logger = factory();

const logger2 = factory(undefined, 'Main');

const logger3 = factory(undefined, 'Main2', 'MainFunc');

logger.debug('this is test');

logger2.debug('this is test');

logger2.info('this is test');

logger2.warning('this is test');

logger2.error('this is test');

logger3.debug('this is test');

logger2.debug('Main', 'MainFunc2', 'this is test');

logger2.debug('Main', 'MainFunc3', 'this is test', 'subtest');

logger2.warning('Main', 'MainFunc', 'this is warning');
