export default {
	onInit: async ()=>{
		Object.keys(appsmith.store).forEach(each=>{
			storeValue(each, undefined);
		})
		await this.getPRLatestRun();
		await this.last100PRruns();
		this.setSelectedTab();
	},
	setSelectedTab: ()=>{
		if(appsmith.URL.queryParams.pull_request_id){
			 storeValue('selectedTab', 'PR Summary')
		}else{
			 storeValue('selectedTab', 'PR List')
		}
	},
	getMetricsToShow:()=>{
		return selectMetrics.selectedOptionValues.map(x => "'" + x + "'").toString();
	},
	getMetasOfPR: async (PR)=>{
		const allRuns = appsmith.store.recent_runs_meta;
		const PRRuns = allRuns.filter(each => each.pull_request_id === PR);
		await storeValue('selectedPRMeta', PRRuns);
	},
	prRunsFormatter: each=>({
			label: `${moment(each.created_at).format("MMMM Do YYYY, h:mm a")}(${each.id})`,
			value: each.id
	}),
	last100PRruns: async ()=>{
		const recentRuns = await fetchLast100PRruns.run();
		const allPRs = recentRuns.map(each=> each.pull_request_id)
		const uniquePRs = recentRuns.filter((each, index)=>{
			return allPRs.indexOf(each.pull_request_id) === index;
		})
		storeValue('recent_runs_meta', recentRuns);
		storeValue('pr_array', uniquePRs);
		setInterval(()=>{
			storeValue('hasLoaded', true);
			clearInterval("loadTimer");
		},2000, "loadTimer");
	},
	getPRLatestRun: async (PRMeta)=>{
			const runs = await fetchRunsOfMeta.run({meta: PRMeta});
			storeValue('selectedPRRuns', runs);
	},
	metricsToDisplay:  (allData = fetchRunsOfMeta.data) => {
		const repoMeanMetrics =  fetchRepoMean.data;
		console.log({allData})
		const finalMetrics = allData.reduce((returnMetrics, eachRun)=>{
			const actionMetricObj = returnMetrics[eachRun.action] || {};
			const metricArray = actionMetricObj[eachRun.metric] || [];
			return {
				...returnMetrics,
				[eachRun.action]: {
					...actionMetricObj,
					[eachRun.metric] : [...metricArray, eachRun.value]
				}
			}
		}, {})
		
		const minimizedMetrics = Object.keys(finalMetrics).reduce((returnMinimizedMetrics, eachAction)=>{
			const actionObj = finalMetrics[eachAction];
			const metrics = Object.keys(actionObj);
			const finalMinMetrics = metrics.reduce((returnFinalMinMetrics, eachMetric)=>{
				return {
					...returnFinalMinMetrics,
					[eachMetric]: Math.min(...actionObj[eachMetric])
				}
			},{})
			return {
				...returnMinimizedMetrics,
				[eachAction]: finalMinMetrics
			}
		}, {})
		
		const finalMetricsArray = Object.keys(minimizedMetrics).reduce((returnFinalMetricsArray, eachAction)=>{
			const actionObj = minimizedMetrics[eachAction];
			const flattenMetrics = Object.keys(actionObj).reduce((returnFlattenMetrics, eachMetric)=>{
				const repoMeanForActionMetric = repoMeanMetrics.find(each => each.action === eachAction && each.metric === eachMetric);
				const minMetricObj = {
					metric: eachMetric,
					action: eachAction,
					value: actionObj[eachMetric],
					deviation:  repoMeanForActionMetric ? (((actionObj[eachMetric]/repoMeanForActionMetric.mean) - 1) * 100) : null,
					repoMean: repoMeanForActionMetric ? repoMeanForActionMetric.mean : null
				}
				return [...returnFlattenMetrics,minMetricObj ]
			}, [])
			return [...returnFinalMetricsArray, 
						 ...flattenMetrics]
		}, []);
		return finalMetricsArray;
	}
}