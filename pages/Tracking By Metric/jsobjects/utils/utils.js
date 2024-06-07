export default {
	unitMapToMetric: [{
		metric: "scripting",
		unit: "MS"
	}, {
		metric: "printing",
		unit: "MS"
	}, {
		metric: "rendering",
		unit: "MS"
	}, {
		metric: "ideal",
		unit: "MS"
	}, {
		metric: "others",
		unit: "MS"
	}, {
		metric: "ForcedLayout",
		unit: "events"
	}, {
		metric: "ForcedStyle",
		unit: "events"
	}, {
		metric: "LongHandler",
		unit: "events"
	}, {
		metric: "LongTask",
		unit: "events"
	}],
	myVar2: {},
	getUnitMapToMetric: () => {
		var x = _.find(this.unitMapToMetric, {metric: Select1.selectedOptionValue})
		return x
	},
	onInit: async () => {
		//use async-await or promises
		await GetActions.run();
		await GetMetrics.run();
		if(Select2.selectedOptionValue == 'min'){
			await run_by_metric_min.run();
		}else{
			await run_by_metric.run();
		}
	}
}