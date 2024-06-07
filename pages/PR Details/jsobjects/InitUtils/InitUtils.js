export default {
	init:async ()=>{
		await getAllRepos.run();
		await fetchLast100PRruns.run();
		await getPRMetaRuns.run();
		// await getLatestReleaseMean.run();
		// await getShortTermReleaseMean.run();
		// await this.setCurrentAction(this.getCurrentAction());
	},
	getCurrentRunMetaId:() => {
		const currentRunId = runId.selectedOptionValue.split('_')?.[0];
		return getPRMetaRuns.data.filter(option => {
									console.log(option.value, currentRunId);
									return String(option.value) == String(currentRunId);
								})?.[0]?.id || getPRMetaRuns.data?.[0]?.id;
	},
	getFailureStatsData: (num) => {
		const data = getFailureStats.data;
		const total = data.filter(record => record.failures === 100)?.[0]?.count
		const count =  data.filter(record => record.failures === num)?.[0]?.count;
		return `${count} / ${total}`
	}
}