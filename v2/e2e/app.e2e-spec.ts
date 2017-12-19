import { V2Page } from './app.po';

describe('v2 App', function() {
  let page: V2Page;

  beforeEach(() => {
    page = new V2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
