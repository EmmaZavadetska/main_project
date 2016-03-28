(function() {
    "use strict";

    angular.module("app.admin")
        .directive("validateDirective", validateDirective);

    validateDirective.$inject = ["SPECIALITIES_CONST", "specialitiesService"];

    function validateDirective(SPECIALITIES_CONST, specialitiesService) {
        var all;
        getSpecialities();
        function getSpecialities(){
            specialitiesService.getSpecialities().then(function(data) {
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
            if (inputName === "specialityName"){
                attr.regexp = SPECIALITIES_CONST.NAME_REGEXP;
                attr.key = "speciality_name";
            } else if (inputName === "specialityCode") {
                attr.regexp = SPECIALITIES_CONST.CODE_REGEXP;
                attr.key = "speciality_code";
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
     }

})();