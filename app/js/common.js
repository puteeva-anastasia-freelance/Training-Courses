$(function () {
	$('select').select2();

	$.datepicker.setDefaults($.datepicker.regional["ru"]);

	var dateFormatD = "dd.mm.yy",
		fromD = $("#datepicker-from")
		.datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1,
			minDate: 0
		})
		.on("change", function () {
			toD.datepicker("option", "minDate", getDate(this));
		}),
		toD = $("#datepicker-to").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1,
			minDate: 0
		})
		.on("change", function () {
			fromD.datepicker("option", "maxDate", getDate(this));
		});

	var dateFormat = "dd.mm.yy",
		from = $("#filter-from")
		.datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1,
			minDate: 0
		})
		.on("change", function () {
			to.datepicker("option", "minDate", getDate(this));
		}),
		to = $("#filter-to").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1,
			minDate: 0
		})
		.on("change", function () {
			from.datepicker("option", "maxDate", getDate(this));
		});

	function getDate(element) {
		var dateD;
		try {
			dateD = $.datepicker.parseDate(dateFormatD, element.value);
		} catch (error) {
			dateD = null;
		}

		return dateD;
	}

	function getDate(element) {
		var date;
		try {
			date = $.datepicker.parseDate(dateFormat, element.value);
		} catch (error) {
			date = null;
		}

		return date;
	}

	$("#datepicker-date").datepicker({
		minDate: 0
	});
});