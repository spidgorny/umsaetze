import Window from './DOM/Window';

global['window'] = new Window();

import Workspace from '../Workspace';

class TestNewWorkspace {

	constructor() {
		new Workspace();
	}

}

new TestNewWorkspace();
