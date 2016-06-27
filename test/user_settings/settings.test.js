/*'use strict';

describe('Settings', function () {
    var settingsProvider, service, addPageSpy, setDefaultPageSpy;

    beforeEach(module('pipRest'));


    beforeEach(function () {
        module('pipSettings', function (pipSettingsProvider) {
            settingsProvider = pipSettingsProvider;
            addPageSpy = sinon.spy(settingsProvider, 'addPage');
            setDefaultPageSpy = sinon.spy(settingsProvider, 'setDefaultPage');

        });

        module('pipUserSettings');
    });

    it('should register 4 pages in settings and set "basic_info" as default one', inject(function () {
        assert.equal(addPageSpy.callCount, 5);
        assert.equal(addPageSpy.args[0][0].state, 'basic_info');
        assert.equal(addPageSpy.args[1][0].state, 'contact_info');
        assert.equal(addPageSpy.args[2][0].state, 'sessions');
        assert.equal(addPageSpy.args[3][0].state, 'activities');

        assert.equal(setDefaultPageSpy.callCount, 1);
        assert.equal(setDefaultPageSpy.args[0], 'basic_info');
    }));

});
*/