'use strict';

describe("Testing Questions controller", function () {
    var controller, questionsService;
    
    beforeEach(module("app"));

    beforeEach(inject(function ($controller, _questionsService_) {
        questionsService = _questionsService_;
        controller = $controller("QuestionsController", {
            questionsService: questionsService
        });
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

    describe("Testing called getTypes", function() {
        var  deferred, $scope;
        beforeEach(inject(function ($q, $rootScope) {
            deferred = $q.defer();
            $scope = $rootScope.$new();
            spyOn(questionsService, "getTypes").and.callThrough();
            spyOn(questionsService, "getQuestionsRange").and.returnValues(deferred.promise);
            questionsService.getTypes();
            questionsService.getQuestionsRange();
        }));

        it("tracks that the spy was called", function() {
            expect(questionsService.getTypes).toHaveBeenCalled();
            expect(questionsService.getTypes).toHaveBeenCalledTimes(1);
            expect(questionsService.getQuestionsRange).toHaveBeenCalled();
        });
        
    });
});