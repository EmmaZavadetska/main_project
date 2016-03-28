(function() {
    "use strict";

    angular.module("app.admin")
        .directive("validDirective", validDirective);

    validDirective.$inject = ["FACULTIES_CONST", "facultiesService"];

    function validDirective(FACULTIES_CONST, facultiesService) {
        var all;
        getFaculties();

        function getFaculties(){
            facultiesService.getFaculties().then(function(data) {
                all = data;
            });
        }

        function validText(regexp, text) {

            return regexp.test(text);
        }

        function alreadyExist(arrObj, key, text){
            for (var i = 0; i < arrObj.length; i++) {
                if (arrObj[i][key] === text) {

                    return true;
                }
            }

            return false;
        }

        function whichInput(inputName){
            var attr = {};
            if (inputName === "facultyName"){
                attr.regexp = FACULTIES_CONST.CHAR_REGEXP;
                attr.key = "faculty_name";
            } else if (inputName === "facultyDesc"){
                attr.regexp = FACULTIES_CONST.CHAR_REGEXP;
                attr.key = "faculty_description";
            }

            return attr;
        }

        return {
            restrict: "A",
            require: "ngModel",
            link: function(scope, element, attr, mCtrl) {
                function validation(value) {
                    mCtrl.$setValidity("validText", validText(whichInput(attr.name).regexp, value));
                    mCtrl.$setValidity("alreadyExist", !alreadyExist(all, whichInput(attr.name).key, value));

                    return value;
                }
                mCtrl.$parsers.push(validation);
            }
        };
    };

})();