/*'use strict';

describe('Settings Sessions', function () {
    var settingsProvider, scope, service, addPageSpy, setDefaultPageSpy,
        controller, pipTransaction, party, $timeout, rootScope, $httpBackend;
    var pipTestUserParty, beginTransactionSpy;

    beforeEach(module('pipRest'));

    beforeEach(function () {
        module('pipSettings', function (pipSettingsProvider) {
            settingsProvider = pipSettingsProvider;
            addPageSpy = sinon.spy(settingsProvider, 'addPage');
            setDefaultPageSpy = sinon.spy(settingsProvider, 'setDefaultPage');
        });

        module('pipUserSettings');
        module('pipTest.UserParty');
        module('pipTest.General');
        module('pipUserSettings.Sessions');
    });

    beforeEach(inject(function ($controller, $rootScope, _$state_, _pipTestUserParty_, _$timeout_, $injector, _pipRest_,
                           $mdDialog, _pipTranslate_, _pipTransaction_, _pipFormErrors_, _pipUserSettingsPageData_,
                           _pipToasts_) {
        pipTestUserParty = _pipTestUserParty_;
        party = pipTestUserParty.getParty();
        var user=pipTestUserParty.getOneUser();
        $timeout = _$timeout_;
        $rootScope.$party = party;
        scope = $rootScope.$new();
        controller = $controller('pipUserSettingsSessionsController', {
            $scope: scope,
            $rootScope: $rootScope,
            $mdDialog: $mdDialog,
            pipTranslate: _pipTranslate_,
            pipTransaction: _pipTransaction_,
            pipFormErrors: _pipFormErrors_,
            pipUserSettingsPageData: _pipUserSettingsPageData_,
            pipToasts: _pipToasts_,
            sessions: user.sessions,
            sessionId:1
        });
        rootScope = $rootScope;
        pipTransaction = _pipTransaction_;
        scope.transaction = pipTransaction('settings.sessions', scope);
        beginTransactionSpy = sinon.spy(scope.transaction, 'begin');

        _pipRest_.serverUrl("http://alpha.pipservices.net");
        $httpBackend = $injector.get('$httpBackend');
        scope.form = {};
        scope.form.$setPristine = function () {
        };
        scope.form.$setUntouched = function () {
        };
        scope.form.$setDirty = function () {
        };
        scope.form.$setSubmitted = function () {
        };

    }));

    it('should be able to reject user (error case, empty case)', function (done) {

        var requestHandler = $httpBackend
            .when('DELETE', 'http://alpha.pipservices.net/api/users/sessions/'+scope.sessions[0].id)
            .respond(101, {message: 'ERROR_101', code: 101});

        scope.onRemove(scope.sessions[0]);
        $httpBackend.flush();
        assert.equal(scope.message, 'ERROR_101');
        done();

    });

    it('should be able to reject user (success case)', function (done) {

        var requestHandler = $httpBackend
            .when('DELETE', 'http://alpha.pipservices.net/api/users/sessions/'+scope.sessions[0].id)
            .respond();

        scope.onRemove(scope.sessions[0]);
        $httpBackend.flush();
        assert.deepEqual(scope.sessions, []);
        done();

    });

});
*/