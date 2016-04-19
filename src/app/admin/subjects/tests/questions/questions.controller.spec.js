describe("QuestionsController Test", function () {

    beforeEach(angular.mock.module("app"));
    
    var controller, scope;

    beforeEach(angular.mock.inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        controller = $controller("QuestionsController", {
            $scope: scope
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
