export default {
	getRowStyle: (currentRow) => !currentRow['Run 1']?'#e6e7e6':'',
	getDiffTextColor: (diff) => diff < 0 ? 'red' : 'green',
}