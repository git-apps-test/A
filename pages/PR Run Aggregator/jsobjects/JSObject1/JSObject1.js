export default {
	myVar1: [],
	myVar2: {},
	myFun1: () => {
		var output = get_app_run_on_PR.data.reduce((result, item) => {

  // Get app object corresponding to current item from result (or insert if not present)
  var app = result[item.action] = result[item.action] || {};

  // Get type array corresponding to current item from app object (or insert if not present)
  var type = app[item.meta] = app[item.meta] || [];

  // Add current item to current type array
  type.push(item);

  // Return the result object for this iteration
  return output;
	},
	myFun2: async () => {
		//use async-await or promises
	}
}