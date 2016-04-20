'use strict';
describe("QuestionsController Test", function () {

    beforeEach(angular.mock.module("app"));
    
    var controller, scope, _questionsService_;

    // beforeEach(angular.mock.inject(function ($controller, $rootScope, questionsService) {
    //     scope = $rootScope.$new();
    //     controller = $controller("QuestionsController", {
    //         $scope: scope
    //     });
    //     _questionsService_ = questionsService;
    //     spyOn(questionsService, "getQuestionsRange").andCallThrough();
    //     spyOn(questionsService, "getCountQuestionsByTest").andCallThrough();
    //     spyOn(questionsService, "getOneQuestion").andCallThrough();
    //     spyOn(questionsService, "getQuestionsByTest").andCallThrough();
    //     spyOn(questionsService, "saveQuestion").andCallThrough();
    //     spyOn(questionsService, "removeQuestion").andCallThrough();
    // }));
    
    beforeEach(angular.mock.inject(function ($controller) {
        // scope = $rootScope.$new();
        controller = $controller("QuestionsController", {
            _questionsService_: mockQuestionsService
        });
    }));

    it("should have controller defined and conrtoller's property", function () {
        expect(controller).toBeDefined();
        expect(controller.saveQuestion).toBeDefined();
        expect(controller.removeQuestion).toBeDefined();
        expect(controller.saveFormCollapsed).toBe(true);
    });

    it("should have types of questions", function () {
        expect(controller.types).toContain({NAME: "Простий вибір", VALUE: "1"}, {NAME: "Мульти-вибір", VALUE: "2"});
    });
});
