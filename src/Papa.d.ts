declare class Papa {

	static parse(text: string, callback: {
		header: boolean,
		dynamicTyping: boolean,
		skipEmptyLines: boolean
	});

}
