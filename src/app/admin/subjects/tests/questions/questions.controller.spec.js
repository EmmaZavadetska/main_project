'use strict';

describe("QuestionsController", function () {

    beforeEach(angular.mock.module("app"));
    
    var controller, _questionsService_;

    // beforeEach(angular.mock.module(function ($provide) {
    //     mockQuestionsService = {
    //         getTypes: function() {
    //
    //             return [{NAME: "Простий вибір", VALUE: "1"}, {NAME: "Мульти-вибір", VALUE: "2"}];
    //         }
    //     };
    //     $provide.value('questionsService', mockQuestionsService);
    // }));

    beforeEach(angular.mock.inject(function ($controller, questionsService) {
        _questionsService_ = questionsService;
        spyOn(_questionsService_, "getTypes").and.returnValues([{NAME: "Простий вибір", VALUE: "1"}, {NAME: "Мульти-вибір", VALUE: "2"}]);
        controller = $controller("QuestionsController");
        _questionsService_.getTypes();
    }));

    it("should have functions and property defined in controller", function () {
        expect(controller.saveQuestion).toBeDefined();
        expect(controller.removeQuestion).toBeDefined();
        expect(controller.saveFormCollapsed).toBe(true);
    });

    it("should have types of questions", function () {
        var types = [{NAME: "Простий вибір", VALUE: "1"}, {NAME: "Мульти-вибір", VALUE: "2"}];
        expect(controller.types).toContain(types[0], types[1]);
        
    });
    
    it("tracks that the spy was called", function() {
        expect(_questionsService_.getTypes).toHaveBeenCalled();
    });
});
