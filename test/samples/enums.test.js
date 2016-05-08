'use strict';

suite('pipEnums', function () {
    var pipEnums;

    setup(module('pipRest.Enums'));
    
    setup(inject(function(_pipEnums_) {
       pipEnums = _pipEnums_; 
    }));


        
    test('SHARE_LEVEL', function (done) {
        assert.isDefined(pipEnums.SHARE_LEVEL);

        done();
    });

    test('GENDER', function (done) {
        assert.isDefined(pipEnums.GENDER);

        assert.isDefined(pipEnums.GENDERS);
        assert.lengthOf(pipEnums.GENDERS, 3);
        assert.include(pipEnums.GENDERS, 'male');
        assert.include(pipEnums.GENDERS, 'female');
        assert.include(pipEnums.GENDERS, 'n/s');

        done();
    });
});
