/*
'use strict';

describe('Settings Basic info', function () {
    this.timeout(1000000);
    var settingsProvider, scope, service, addPageSpy, setDefaultPageSpy,
        controller, pipTransaction, party, $timeout, rootScope, $httpBackend,
        pipTestUserParty, beginTransactionSpy;

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
        module('pipUserSettings.BasicInfo');
    });

    beforeEach(inject(function ($controller, $rootScope, _$state_, _pipTestUserParty_, _$timeout_, $injector, _pipRest_,
                           $mdDialog, _pipTranslate_, _pipTransaction_, _pipFormErrors_, _pipUserSettingsPageData_,
                           _pipToasts_) {
        pipTestUserParty = _pipTestUserParty_;
        party = pipTestUserParty.getParty();
        $timeout = _$timeout_;
        $rootScope.$party = party;
        scope = $rootScope.$new();
        controller = $controller('pipUserSettingsBasicInfoController', {
            $scope: scope,
            $rootScope: $rootScope,
            $mdDialog: $mdDialog,
            pipTranslate: _pipTranslate_,
            pipTransaction: _pipTransaction_,
            pipFormErrors: _pipFormErrors_,
            pipUserSettingsPageData: _pipUserSettingsPageData_,
            pipToasts: _pipToasts_
        });
        rootScope = $rootScope;
        pipTransaction = _pipTransaction_;
        scope.transaction = pipTransaction('settings.basic_info', scope);
        beginTransactionSpy = sinon.spy(scope.transaction, 'begin');

        _pipRest_.serverUrl( "http://alpha.pipservices.net");
        $httpBackend = $injector.get('$httpBackend');
        scope.form = {};
        scope.form.$setPristine = function () {};
        scope.form.$setUntouched = function () {};
        scope.form.$setDirty = function () {};
        scope.form.$setSubmitted = function () {};

    }));
    it.only('should init transaction and set various properties to $scope on start', function () {
        angular.noop();
        /!*
        assert.deepEqual(scope.genders, [{id: 'male', name: 'male'}, {id: 'female', name: 'female'}, {
            id: 'n/s',
            name: 'n/s'
        }]);
        assert.deepEqual(scope.$party, party);*!/

    });

    it('should be able to change', function (done) {

        var setSubmittedSpy = sinon.spy(scope.form, '$setSubmitted');
        rootScope.$party.name = '1';

        var requestHandler = $httpBackend
            .when('PUT', 'http://alpha.pipservices.net/api/parties/'+ rootScope.$party.id)
            .respond(rootScope.$party);

        scope.onChangeBasicInfo();
        setTimeout(function (){

            assert.isTrue(setSubmittedSpy.called);
            $httpBackend.flush();
            assert.equal(scope.nameCopy, rootScope.$party.name);
            done();
        }, 2000);

    });

    it('should be able to save changes to user profile (error case)', function (done) {

        var setSubmittedSpy = sinon.spy(scope.form, '$setSubmitted');
        rootScope.$party.name = '1';

        var requestHandler = $httpBackend
            .when('PUT', 'http://alpha.pipservices.net/api/parties/'+ rootScope.$party.id)
            .respond(101, {message: 'ERROR_101', code: 101});

        scope.onChangeBasicInfo();
        setTimeout(function (){
            assert.isTrue(setSubmittedSpy.called);
            $httpBackend.flush();
            assert.equal(scope.message, 'ERROR_101');
            done();
        }, 2000);

    });
});
*/
