/*'use strict';

describe('Settings', function () {
    var stateProvider,
        service, stateSpy;

    beforeEach(module('pipRest'));

    beforeEach(function () {
        module('pipRouting', function (pipAuthStateProvider) {
            stateProvider = pipAuthStateProvider;
            stateSpy = sinon.spy(stateProvider, 'state');
        });

        module('pipSettings');
    });

    beforeEach(inject(function (pipSettings) {
        service = pipSettings;
    }));


    it('should be able to add new page and get list of added pages', function (done) {
        var access = function () {
        };

        var page1 = {
            state: 'test',
            title: 'Test settings page',
            stateConfig: {
                url: '/test',
                template: '<h1>This is test page in settings inserted through provider</h1>'
            }
        };

        service.addPage(page1);

        service.addPage({
            state: 'test2',
            visible: false,
            access: access,
            stateConfig: {}
        });
        assert.isDefined(stateSpy.called);

        assert.equal(service.getDefaultPage().state, 'settings.' + page1.state);
        assert.equal(service.getDefaultPage().title, page1.title);
        assert.equal(service.getDefaultPage().stateConfig.url, page1.stateConfig.url);
        assert.equal(service.getDefaultPage().stateConfig.template, page1.stateConfig.template);

        assert.throws(function () {
            service.addPage({
                state: 'test',
                stateConfig: {}
            })
        }, true);

        done();
    });

    it('should be able to add new page and get list of added pages', function (done) {
        var access = function () {
        };

        var page1 = {
            state: 'test',
            title: 'Test settings page',
            stateConfig: {
                url: '/test',
                template: '<h1>This is test page in settings inserted through provider</h1>'
            }
        };

        service.addPage(page1);

        service.addPage({
            state: 'test2',
            visible: false,
            access: access,
            stateConfig: {}
        });

        service.setDefaultPage('test2');

        assert.isDefined(stateSpy.called);

        assert.equal(service.getDefaultPage().state, 'settings.test2');

        assert.throws(function () {
            service.setDefaultPage('abc');
        }, true);

        done();
    })

});
*/