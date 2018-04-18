idList = [];
for (let i in localStorage) {
	console.log(i);
	if (i.includes('Expenses-')) {
		const [_, id] = i.split('-');
		idList.push(id);
	}
}
console.log(idList.join(','));
