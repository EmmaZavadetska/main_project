'use strict';

describe ("Test Students Controller", function () {
    beforeEach(module("app.admin.groups"));
    beforeEach(module("app"));

    var controller;
    var customDialog;

    var studentsServiceMock = {};

    var student = {
        "user_id": "90",
        "gradebook_id": "yudsdded",
        "student_surname": "Соло",
        "student_name": "Андрій",
        "student_fname": "Іванович",
        "group_id": "3",
        "plain_password": "jo4xif529",
        "photo": ""
    };
    studentsServiceMock.getHeadElements = function (){
        return ["Ім'я", "Прізвище", "По-батькові", "Номер залікової книги", "Група"];
    };


    studentsServiceMock.getStudentsByGroupId = function (){
        return [{
            "user_id": "105",
            "gradebook_id": "yudsddssdded",
            "student_surname": "Солототототототототототот",
            "student_name": "Андрій",
            "student_fname": "Олегович",
            "group_id": "11",
            "plain_password": "jo4xi529",
            "photo": ""
        }, {
            "user_id": "90",
            "gradebook_id": "yudsdded",
            "student_surname": "Соло",
            "student_name": "Андрій",
            "student_fname": "Іванович",
            "group_id": "3",
            "plain_password": "jo4xif529",
            "photo": ""
        }];
    };

    studentsServiceMock.removeStudent = function () {
        var deferred = $q.defer();
        deferred.resolve("Call");
        return deferred.promise;
    };

    beforeEach(function(){
        angular.module('test', ["app.admin.groups"]).value("studentsService", studentsServiceMock);
    });

    beforeEach(inject(function ($controller, _customDialog_, $q) {
        controller = $controller("StudentsController", {});
        customDialog = _customDialog_;
        spyOn(customDialog, "openDeleteDialog").and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve("Call fake promise");
            return deferred.promise;
        });
        spyOn(customDialog, "openInformationDialog").and.callFake(function(){
            var deferred = $q.defer();
            deferred.resolve("Call fake promise");
            return deferred.promise;
        });
    }));

    beforeEach(function(){
        spyOn(studentsServiceMock, "removeStudent");
    });

    it("max", function(){
        expect(controller.maxSize).toBe(3);
    });

    it("get head elements", function(){
        expect(controller.headElements).toEqual(["Ім'я", "Прізвище", "По-батькові", "Номер залікової книги", "Група"]);
    });

    beforeEach(function(){
        controller.studentRemover(student);
    },5000);

    it("remove", function(){
        expect(customDialog.openDeleteDialog).toHaveBeenCalled();
        //expect(studentsServiceMock.removeStudent).toHaveBeenCalled();
        //expect(studentsServiceMock.removeStudent).toHaveBeenCalledWith(44);
    });
});