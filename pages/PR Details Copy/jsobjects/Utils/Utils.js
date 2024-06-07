export default {
	getMetricsToShow:()=>{
		return selectMetrics.selectedOptionValues.map(x => "'" + x + "'").toString();
	},
	getStandardDeviation: (array)=> {
		const n = array.length
		const mean = array.reduce((a, b) => a + b) / n
		const sd= Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
		return sd/mean*100
},
	getFromattedRunData: () => {
		let formatted= _.groupBy(getRunData.data,'action')
		Object.entries(formatted).forEach(
				([key, value]) => {
				formatted[key]= _.groupBy(value,'metric')
				}
		);


		const out =[]
		Object.entries(formatted).forEach(([key,value])=>{	
				// Level #1 Actions
				out.push({action:key})
				Object.entries(value).forEach(([key,values])=>{
				// Level #2 Metrics
				const row = {action:key}
				let runValues=[]
				values.forEach((value,i)=>{
						row[`Run ${i+1}`]=value.value
					runValues.push(value.value)
				})
					
					// Add SD
			const sd=parseFloat(this.getStandardDeviation(runValues).toFixed(2));
			row.sd=sd
				out.push(row)
				})
		})
		return out;
	},
	myFun2: async () => {
		//use async-await or promises
	}
}