export default {
	getCustomLineChart: () => {
  	const config = {
			type: "msline",
			dataSource: {
				chart: {
					caption: Utils.getCurrentAction() ? (String(Utils.getCurrentAction()) + " : Metrics trend across releases") : "Please Select an Action to see metrics across releases",
					subCaption: "Showing selected metrics for the action:"+ Utils.getCurrentAction() +" across releases",
					xAxisName: "<i>Pull Request ID (Run Meta)</i>",
					yAxisName: "MS",
					theme: "fusion"
    		},
				categories: [{category: []}],
				dataset: [],
				trendlines: [
						{
								line: []
						}
				]
			}
		}
		
		const data = getLastReleaseRuns.data.filter(data => Number(data.prid) > 0).reverse();
		
		// create the config object for the chart with the given data
		data.forEach((v) => {
			if(!_.find(config.dataSource.categories[0].category, {label: `<a target="_blank" href="https://github.com/appsmithorg/appsmith/pull/${v.prid}">${v.prid}</a>(${v.meta})`})) {
				config.dataSource.categories[0].category.push({label: `<a target="_blank" href="https://github.com/appsmithorg/appsmith/pull/${v.prid}">${v.prid}</a>(${v.meta})`})
			}
			//if(!_.find(config.dataSource.categories[0].category, {label: `${v.prid}(${v.meta})`})) {
			//	config.dataSource.categories[0].category.push({label: `${v.prid}(${v.meta})`})
			//}
			if(!_.find(config.dataSource.dataset, {seriesname: v.metric})) {
				config.dataSource.dataset.push({seriesname: v.metric, data: [{value: v[MedianMinSelect.selectedOptionValue ?? 'value']}]})
			}
			else {
				_.find(config.dataSource.dataset, {seriesname: v.metric}).data.push({value: v[MedianMinSelect.selectedOptionValue ?? 'value']})
			}
		})
		return config
	},
}