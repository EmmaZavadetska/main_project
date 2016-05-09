'use strict';

describe("Testing Questions service", function() {
    var $httpBackend, BASE_URL, URL, TYPES_OF_QUESTION, questionsService;

    beforeEach(module("app"));

    beforeEach(inject(function (_$httpBackend_, _BASE_URL_, _URL_, _TYPES_OF_QUESTION_, _questionsService_) {
        $httpBackend = _$httpBackend_;
        BASE_URL = _BASE_URL_;
        URL = _URL_;
        TYPES_OF_QUESTION = _TYPES_OF_QUESTION_;
        questionsService = _questionsService_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should have initialize correctly", function() {
        expect(questionsService).toBeDefined();
    });

    it("should have include all methods", function() {
        expect(questionsService.getQuestionsRange).toBeDefined();
        expect(questionsService.getCountQuestionsByTest).toBeDefined();
        expect(questionsService.getOneQuestion).toBeDefined();
        expect(questionsService.getQuestionsByTest).toBeDefined();
        expect(questionsService.saveQuestion).toBeDefined();
        expect(questionsService.removeQuestion).toBeDefined();
        expect(questionsService.getHeader).toBeDefined();
        expect(questionsService.getLevels).toBeDefined();
        expect(questionsService.getTypes).toBeDefined();
    });
    
    it("should have return array of header's elements for table", function() {
        var headerElements = ["Завдання", "Рівень", "Тип"];
        expect(questionsService.getHeader()).toEqual(headerElements);
    });

    it("should have return array of question's types", function() {
        expect(questionsService.getTypes()).toContain(TYPES_OF_QUESTION.MULTI);
    });
    
    it("should get a question", function() {
        var question_id = 1;
        $httpBackend.expectGET(BASE_URL + URL.ENTITIES.QUESTION + URL.GET_ENTITIES + question_id)
            .respond([{
                "question_id":"1",
                "test_id":"1",
                "question_text":"Inside which HTML element do we put the JavaScript?",
                "level":"2",
                "type":"2",
                "attachment":""
            }]);
        var promise = questionsService.getOneQuestion(question_id);
        promise.then(function(data) {
            expect(angular.isObject(data)).toBeTruthy();
            expect(data.length).toEqual(1);
        });
        $httpBackend.flush();
    });
});