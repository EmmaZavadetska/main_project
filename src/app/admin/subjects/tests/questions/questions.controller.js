(function() {
    "use strict";

    angular.module("app.admin.subjects")
        .controller("QuestionsController", QuestionsController);

    QuestionsController.$inject = ["$stateParams", "questionsService", "PAGINATION", "MESSAGE"];

    function QuestionsController($stateParams, questionsService, PAGINATION, MESSAGE) {
        var vm = this;
        vm.showSaveForm = showSaveForm;
        vm.hideSaveForm = hideSaveForm;
        vm.saveFormCollapsed = true;
        vm.headElements = questionsService.getHeader();
        vm.levels = questionsService.getLevels();
        vm.types = questionsService.getTypes();
        vm.saveQuestion = saveQuestion;
        vm.removeQuestion = removeQuestion;
        vm.image;
        vm.maxSize = PAGINATION.PAGES_SHOWN;
        vm.currentPage = PAGINATION.CURRENT_PAGE;
        vm.currentRecordsRange = 0;
        vm.pageChanged = pageChanged;
        vm.subject_id = $stateParams.subject_id;
        activate();

        function activate() {
            getCountQuestionsByTest();
            getQuestionsRange();
        }

        function getCountQuestionsByTest() {
            questionsService.getCountQuestionsByTest($stateParams.test_id).then(function(quantity) {
                vm.quantityQuestions = quantity;
                if (vm.quantityQuestions > PAGINATION.ENTITIES_RANGE_ON_PAGE) {
                    vm.showPagination = true;
                } else {
                    vm.showPagination = false
                }
            });
        }

        function getQuestionsRange() {
            questionsService.getQuestionsRange(vm.currentRecordsRange, $stateParams.test_id).then(function(data) {
                if (Array.isArray(data)) {
                    vm.questionsList = data;
                } else {
                    vm.questionsList = [];
                }
            });
        }

        function showSaveForm(question) {
            vm.saveFormCollapsed = false;
            vm.image = null;
            if (question === undefined) {
                vm.question = {};
            } else {
                vm.question = question;
                if (question.attachment != "") {
                    vm.image = question.attachment;
                }
            }
        }

        function hideSaveForm() {
            vm.saveFormCollapsed = true;
            vm.question = {};
            vm.image = null;
        }

        function saveQuestion() {
            if (vm.image != null) {
                vm.question.attachment = vm.image;
            }
            questionsService.saveQuestion(vm.question, $stateParams.test_id).then(function(data) {
                if(data.response === "ok"){
                    alert(MESSAGE.SAVE_SUCCSES);
                } else{
                    alert(MESSAGE.SAVE_ERROR +  " " + data.response);
                }
                activate();
                hideSaveForm();
            });
        }

        function removeQuestion(question) {
            questionsService.removeQuestion(question.question_id).then(function(data) {
                if (data.response === "ok") {
                    alert(MESSAGE.DEL_SUCCESS)
                } else if (data.response === "error 23000") {
                    alert(MESSAGE.DEL_ERROR);
                }
                activate();
            });
        }

        function getNextRange() {
            vm.currentRecordsRange = (vm.currentPage - 1) * PAGINATION.ENTITIES_RANGE_ON_PAGE;
        }

        function pageChanged(){
            getNextRange();
            getQuestionsRange();
        }
    }
})();