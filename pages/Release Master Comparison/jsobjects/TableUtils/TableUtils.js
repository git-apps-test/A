export default {
	getTableData : () => {
		const data = getLatestReleaseComparisons.data;
		const results = [];
		for(const record of data) {
			const created = moment(record.created_at);
			const dat = {...record};
			if(!record.is_merge_commit) {
				for(const release of data) {
					const releaseCreated = moment(release.created_at);
					if(releaseCreated.isBefore(created) && release.is_merge_commit) {
						dat.comparisonMedian = release.lt_median_failure;
						dat.comparsonMin = release.lt_min_failure;
						break;
					}
				}
			}
			else {
				dat.comparisonMedian = null;
				dat.comparsonMin = null;
			}
			results.push(dat);
		}
		return results;
	}
}