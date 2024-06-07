export default {
	init: async () => {
		await getAllRepos.run();
		await getMetrics.run();
		await getLastReleaseRuns.run();
	},
	defaultMetrics: [
		"scripting",
		"rendering",
		"worker_scripting"
	],
	getMetricsToShow:()=>{
		return selectMetrics.selectedOptionValues.map(x => "'" + x + "'").toString();
	},
	getLineChartList: () => {
		const data = getLastReleaseRuns.data;
		const listData = Object.values(_.groupBy(data, 'action'));
		return listData.map(value => ({
			action: value[0].action,
			config: this.getCustomLineChart(value[0].action, value)
		}));
	},
	getCustomLineChart: (action, actionData) => {
  	const config = {
			type: "msline",
			dataSource: {
				chart: {
					caption: action ? (String(action) + " : Metrics trend across releases") : "Please Select an Action to see metrics across releases",
					subCaption: "Showing selected metrics for the action:"+ action +" across releases",
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
		
		// const data = getLastReleaseRuns.data.filter(data => Number(data.prid) > 0).reverse();
		
		// create the config object for the chart with the given data
		actionData.filter(data => Number(data.prid) > 0).reverse().forEach((v) => {
			if(!_.find(config.dataSource.categories[0].category, {label: `<a target="_blank" href="https://github.com/appsmithorg/appsmith/pull/${v.prid}">${v.prid}</a>(${v.meta})`})) {
				config.dataSource.categories[0].category.push({label: `<a target="_blank" href="https://github.com/appsmithorg/appsmith/pull/${v.prid}">${v.prid}</a>(${v.meta})`})
			}
			//if(!_.find(config.dataSource.categories[0].category, {label: `${v.prid}(${v.meta})`})) {
			//	config.dataSource.categories[0].category.push({label: `${v.prid}(${v.meta})`})
			//}
			const metrics = v.metrics.reduce((acc, val)=> ({
				...acc,
				[val.metric]: {
					value: val.value,
					min: val.min,
				}
			}), {});
			for(const metric of selectMetrics.selectedOptionValues) {
				if(!_.find(config.dataSource.dataset, {seriesname: metric})) {
					config.dataSource.dataset.push({seriesname: metric, data: [{value: metrics[metric]?.[MeanMinSelect.selectedOptionValue] ?? 0}]})
				}
				else {
					_.find(config.dataSource.dataset, {seriesname: metric}).data.push({value: metrics[metric]?.[MeanMinSelect.selectedOptionValue] ?? 0})
				}
			}
			
		});
		console.log(config.dataSource.dataset);
		return config
	},
	getPrUrlFromTag: (tag) => {
		return tag.split('href=&#034;')?.[1]?.split('&#034;')?.[0];
	},
}