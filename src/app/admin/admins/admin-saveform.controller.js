(function() {
    "use strict";
 
    angular.module("app.admin")
        .controller("AdminSaveFormController", AdminSaveFormController);

    AdminSaveFormController.$inject = ["$uibModalInstance", "adminService", "admin", "kindOfSave", "VALID"];

    function AdminSaveFormController($uibModalInstance, adminService, admin, kindOfSave, VALID) {
        var vm = this;
        vm.admin = (admin === null) ? {} : admin;
        vm.passwordPlaceholder = (admin === null) ? VALID.PASSWORD_PLACEHOLDER + " *" : VALID.PASSWORD_PLACEHOLDER;
        vm.confirmPasswordPlaceholder = (admin === null) ? VALID.CONFIRM_PASSWORD_PLACEHOLDER + " *" : VALID.CONFIRM_PASSWORD_PLACEHOLDER;
        vm.kindOfSave = kindOfSave;
        vm.comparePasswords = comparePasswords;
        vm.maxUsernameLength = VALID.MAX_USERNAME_LENGTH;
        vm.maxPasswordLength = VALID.MAX_PASSWORD_LENGTH;
        vm.save = save;
        vm.cancel = cancel;

         function comparePasswords(){
            vm.admin.password = vm.newPassword;
            return (vm.newPassword === vm.confirmPassword);
        }

        function save() {
            $uibModalInstance.close(vm.admin);
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();