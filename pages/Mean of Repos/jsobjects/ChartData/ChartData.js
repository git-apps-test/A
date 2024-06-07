export default {
	onTabChange: async()=>{
		await storeValue("chart_data", {});
		await ChartData.formMeanGraph();
	},
	getListData: ()=>{
		const selectedOptions = Tabs1.selectedTab === "appsmith" ? ActionsSelect.selectedOptionValues : ActionsSelectCopy.selectedOptionValues
		if(selectedOptions.includes('All')){
			return ChartData.actionsToDisplay.data;
		}else{
			return ChartData.actionsToDisplay.data.filter(each => selectedOptions.includes(each.value))
		}
	},
	formMeanGraph: async () => {
		const repo = Tabs1.selectedTab;
		const branch='release';
		const metric = SelectMetricsAppsmith.selectedOptionValue || 'scripting'
		const allRunMeta = await fetchAllRunMetaOfRepoBranch.run({repo, branch});
		const allCommits = allRunMeta.map(each => each.commit_id);
		const medianEntries = await fetchMedianEntriesOfCommits.run({allCommits: `('${allCommits.join(`','`)}')`, metric});
		
		const allActions = await fetchAllActions.run();
		console.log(`('${allCommits.join(`','`)}')`);
		const finalChartData = allActions.reduce((returnObj, eachAction)=>{
			const actionMedianEntries = medianEntries.filter(each => each.action === eachAction.name);
			const entries = actionMedianEntries.map((each)=>({
				x: each.commit_id.slice(0, 7),
				y: each.mean
			}));
			console.log({entries, eachAction})
			returnObj[eachAction.name] = entries;
			return returnObj
		}, {})
		console.log(finalChartData)
		storeValue("chart_data", finalChartData);
	},
	metricsToDisplay: async ()=>{
		const allMetrics = await fetchAllMetrics.run();
		return allMetrics.map(each=>{
			return {
				label: each.name,
				value: each.name
			}
		})
	},
		actionsToDisplay: ()=>{
		const allMetrics = fetchAllActions.data;
		return allMetrics.map(each=>{
			return {
				label: each.name,
				value: each.name
			}
		})
	},
}