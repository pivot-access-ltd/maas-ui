/* Copyright 2017 Canonical Ltd.  This software is licensed under the
 * GNU Affero General Public License version 3 (see the file LICENSE).
 *
 * Test Setup
 *
 * Special setup that occurs only for unit testing.
 */

angular.module("MAAS").run([
  "LogService",
  function(LogService) {
    // Silence logging by default in the tests.
    LogService.logging = false;

    // Make our own monotonic clock for testing, since the unit test suite
    // won't have $window.performance.
    var time = 0;
    LogService.now = function() {
      return time++;
    };
  }
]);

beforeEach(function() {
  window.MAAS_config = {};
  angular.mock.module("MAAS");
  angular.mock.module(($provide) => {
    $provide.constant("VERSION", { version: "1", subversion: "2" });
    $provide.constant("COMPLETED_INTRO", true);
    $provide.constant("SITE_NAME", "test");
  });
});

window.DEBUG = true;
