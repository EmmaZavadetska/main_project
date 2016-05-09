describe("Specialities service", function () {
	var specialitiesService, httpBackend, BASE_URL, URL, PAGINATION;
	var specialities = [
		{"speciality_id":"1","speciality_code":"6.050201","speciality_name":"Геологія"},
		{"speciality_id":"2","speciality_code":"6.050102","speciality_name":"Біологія"},
		{"speciality_id":"3","speciality_code":"6.050103","speciality_name":"Мистецтво"},
		{"speciality_id":"4","speciality_code":"6.051003","speciality_name":"Будівництво"}
	];
			
	beforeEach(module("app.admin"));
	beforeEach(module("app"));

	beforeEach(inject(function (_specialitiesService_, $httpBackend, _BASE_URL_, _URL_, _PAGINATION_) {
		specialitiesService = _specialitiesService_;
		httpBackend = $httpBackend;
		BASE_URL = _BASE_URL_;
		URL = _URL_;
		PAGINATION = _PAGINATION_;
	}));

	it("should return head elements of table", function() {
		var headElements = ["Назва", "Код"];
		expect(specialitiesService.getHeader()).toEqual(headElements);
	});

	it("should get list of specialities for one page of pagination", function() {
		var rangeOnPage = 2;
		for (var currentRecordsRange = 0; currentRecordsRange < 2; currentRecordsRange++) {
			httpBackend.whenGET(BASE_URL + URL.ENTITIES.SPECIALITY + URL.GET_ENTITY_RANGE + rangeOnPage + "/" + currentRecordsRange).respond(
				specialities.slice(currentRecordsRange * rangeOnPage, (currentRecordsRange + 1) * rangeOnPage)
			);
			specialitiesService.getSpecialitiesRange(currentRecordsRange).then(function(data) {
				expect(data).toEqual(specialities.slice(currentRecordsRange * rangeOnPage, (currentRecordsRange + 1) * rangeOnPage));
			});
		}
	});

	it("should get all specialities", function() {
		httpBackend.whenGET(BASE_URL + URL.ENTITIES.SPECIALITY + URL.GET_ENTITIES).respond(specialities);
		specialitiesService.getSpecialities().then(function(data) {
			expect(data).toEqual(specialities);
			console.log(data);
		});
	});

	it ("should get total count of specialities", function() {
		httpBackend.whenGET(BASE_URL + URL.ENTITIES.SPECIALITY + URL.COUNT_ENTITY).respond({"numberOfRecords": specialities.length + ""});
		specialitiesService.totalItems().then(function(data) {
			expect(data).toEqual({"numberOfRecords": specialities.length + ""});
		});
	});
});