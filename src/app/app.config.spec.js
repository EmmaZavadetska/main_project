'use strict';

describe("Testing stateProvider", function () {
    var $state, $httpBackend, $rootScope, BASE_URL, URL, USER_ROLES;

    beforeEach(module("app"));

    beforeEach(inject(function (_$state_, _$httpBackend_,  _$rootScope_, _BASE_URL_, _URL_,_USER_ROLES_) {
        $state = _$state_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        BASE_URL = _BASE_URL_;
        URL = _URL_;
        USER_ROLES = _USER_ROLES_;
    }));

    it("should be user state", function() {
        expect($state.get("user").url).toBe("/user");
        expect($state.get("user").templateUrl).toEqual("app/user/home-user.html");
        expect($state.get("user").controller).toContain("HomeUserController");
        expect($state.get("user").data.authorizedRole).toBe(USER_ROLES.USER);
    });
    
    it("should be admin.questions state", function() {
        expect($state.get("admin.questions").url).toBe("/subjects/{subject_id:int}/tests/{test_id:int}");
        expect($state.get("admin.questions").controller).toEqual("QuestionsController as questions");
    });
    
    it("should go to admin state", function() {
        $httpBackend.expectGET(BASE_URL + URL.IS_LOGGED)
            .respond([{"roles":["login","admin"],"id":"1","username":"admin","response":"logged"}]);
        $state.go("admin");
        $rootScope.$digest();
        expect($state.current.name).toBe("admin");
        expect($state.current.data.authorizedRole).toBe(USER_ROLES.ADMIN);
    });
});