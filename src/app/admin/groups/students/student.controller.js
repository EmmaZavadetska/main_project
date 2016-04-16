(function() {
    "use strict";

    angular.module("app.admin.groups")
        .controller("StudentController", StudentController);

    StudentController.$inject = ["$stateParams", "studentsService", "groupsService", "customDialog", "$state"];

    function StudentController($stateParams, studentsService, groupsService, customDialog, $state) {
        var vm = this;
        vm.addNewStudent = addNewStudent;
        vm.editStudent = editStudent;
        vm.expression = false;
        vm.showElements = false;
        vm.getRandomPas = getRandomPas;
        vm.addElements = true;
        vm.additionalInputs = true;
        vm.disableInputs = false;
        vm.editElements = false;
        vm.editAndAddElement = false;
        vm.group_id = $stateParams.group_id;
        vm.student_id = $stateParams.student_id;
        vm.showAndEditElements = false;
        vm.associativeGroups = {};
        vm.newStudent = getEmptyStudent();
        activate();

        function activate() {
            if ($stateParams.content_type === "show" || $stateParams.content_type === "edit") {
                return studentsService.getStudentById($stateParams.student_id).then(function (response) {
                    vm.editElements = $stateParams.content_type === "edit";
                    vm.disableInputs = $stateParams.content_type === "show";
                    vm.showAndEditElements = true;
                    vm.editElement = $stateParams.content_type === "edit";
                    vm.additionalInputs = $stateParams.content_type === "edit";
                    vm.addElements = false;
                    vm.showElements = $stateParams.content_type === "show";
                    vm.newStudent = {
                        username: response.username || "",
                        password: response.plain_password,
                        password_confirm: response.plain_password,
                        email: response.email || "",
                        gradebook_id: response.gradebook_id,
                        student_surname: response.student_surname,
                        student_name: response.student_name,
                        student_fname: response.student_fname,
                        group_id: response.group_id,
                        plain_password: response.plain_password,
                        photo: response.photo
                    };


                    return vm.newStudent;
                });
            }
        }
        function getEmptyStudent(){
            return {
                username: "",
                password: "",
                password_confirm: "",
                email: "",
                gradebook_id: "",
                student_surname: "",
                student_name: "",
                student_fname: "",
                group_id: "" + vm.group_id,
                plain_password: "",
                photo: ""
            };
        }

        function getRandomPas() {
            var random = Math.random().toString(36).slice(-8);
            vm.newStudent.password = random;
            vm.newStudent.plain_password = random;
            vm.newStudent.password_confirm = random;
        }

        function addNewStudent() {
            if ($stateParams.content_type === "add") {
                vm.addElement = $stateParams.content_type === "add";
                studentsService.addStudent(vm.newStudent).then(function (data) {
                    vm.newStudent = getEmptyStudent();
                    var studentImage = document.getElementById("studentImage");
                    studentImage.removeAttribute("src");
                })
            }
        }

        function editStudent() {
            customDialog.openConfirmationDialog().then(function() {
                studentsService.editStudent(vm.newStudent, $stateParams.student_id).then(function (response) {
                    $state.go("admin.student", {group_id: vm.group_id, content_type: 'show', student_id: vm.student_id});
                    vm.editElements = true;
                    vm.addElements = false;
                    vm.additionalInputs = true;
                    vm.newStudent = {
                        username: response.username,
                        password: response.password,
                        password_confirm: response.password_confirm,
                        email: response.email,
                        gradebook_id: response.gradebook_id,
                        student_surname: response.student_surname,
                        student_name: response.student_name,
                        student_fname: response.student_fname,
                        group_id: response.group_id,
                        plain_password: response.plain_password,
                        photo: response.photo
                    };
                })
            });
        }

        groupsService.getGroups().then(function(data) {
            vm.groups = data;
            for (var i = 0; i < vm.groups.length; i++) {
                vm.associativeGroups[+vm.groups[i].group_id] = vm.groups[i].group_name;
            }
        });

    }
})();