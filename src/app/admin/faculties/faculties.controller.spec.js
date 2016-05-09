'use strict';

describe("FacultiesController", function () {
    beforeEach(module("app.admin"));
    beforeEach(module("app"));
    
    var controller, _facultiesService_;

    beforeEach(angular.mock.inject(function ($controller, facultiesService) {
        controller = $controaller("FacultiesController");
    }));

    it("should have functions and property defined in controller", function () {
        expect(controller.saveFaculty).toBeDefined();
        expect(controller.removeFaculty).toBeDefined();
        expect(controller.saveFormCollapsed).toBe(true);
    });
    
});