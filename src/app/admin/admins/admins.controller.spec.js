"use strict";

describe('AdminsController', function () {
    var scope, ctrl, adminService, uibModal, customDialog, authService, MESSAGE;
    var vm;
    var admins = [
        {
            "id": "1",
            "email": "admin@dtapi.if.ua",
            "username": "admin",
            "password": "1qaz2wsx",
            "logins": "100",
            "last_login": "1462625642"
        },
        {
            "id": "27",
            "email": "root@dtapi.if.ua",
            "username": "root",
            "password": "1qaz2qaz",
            "logins": "10",
            "last_login": "1462622564"
        }
    ]; 
    beforeEach(module("app.admin"));
    beforeEach(module("app"))
    beforeEach(inject(function($controller, _adminService_, $uibModal, _customDialog_, _authService_, _MESSAGE_) {
        ctrl = $controller;
        adminService = _adminService_;
        uibModal = $uibModal;
        customDialog =_customDialog_;
        authService =_authService_;
        MESSAGE =_MESSAGE_;
        ctrl("AdminsController", {
            adminService: adminService,
            $uibModal: uibModal,
            customDialog: customDialog,
            authService: authService,
            MESSAGE: MESSAGE
        });
        vm = ctrl("AdminsController");
        spyOn(adminService, "getHeader").and.returnValue([" ", "Логін", "E-mail", "Останній вхід", "Візитів"]);
        spyOn(adminService, "getAdmins").and.callFake(function () {
            vm.list = admins;
        });
        adminService.getAdmins();

    }));
    it ("should return header element of the table of admins", function() {
        expect(vm.headElements[2]).toEqual("E-mail");
    });

    it("should return admins", function() {
        expect(vm.list).toEqual(admins);
    });

    it("methods and properties should be defined", function() {
        expect(vm.showSaveForm).toBeDefined();
        expect(vm.removeAdmin).toBeDefined();
        expect(vm.list).toBeDefined();
        expect(vm.admin).not.toBeDefined();
        expect(vm.logged).not.toBeDefined();
        expect(vm.kindOfSave).not.toBeDefined();
        expect(vm.animation).toBeTruthy();
    });
});
