(function() {
    "use strict";

    angular.module("app.user")
        .controller("UserSubjectsController", UserSubjectsController);

    UserSubjectsController.$inject = ["userService", "testsService", "customDialog", "$state"];

    function UserSubjectsController(userService, testsService, customDialog, $state) {
        var vm = this;
        vm.headElements = userService.getHeader();
        vm.showAvailableTests = showAvailableTests;

        activate();


        function activate() {
            userService.getCurrentUser().then(function(user) {
                    vm.currentUser = user;
                    return user;
                })
                .then(function(user) {
                    userService.getSchedules(user.group_id).then(function(res) {
                        vm.list = res;
                    })
                })
        }

        function showAvailableTests(subject) {
            vm.currentSubject = subject;
            testsService.getTestsBySubject(subject.subject_id).then(function(res) {
                if(angular.isArray(res)) {
                    vm.availableTest = res.filter(function(item) {
                        return item.enabled === "1";
                    })
                } else {
                    vm.availableTest =[]
                }
            }).then(function() {
                customDialog.openChooseTestDialog(vm.currentSubject.subject_name, vm.availableTest)
                    .then(function(res) {
                        $state.go("user.testPlayer", {test_id: +res});
                    });
            })
        }
    }
})();