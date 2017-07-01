import { SDQRWEBPage } from './app.po';

describe('sdqr-web App', () => {
  let page: SDQRWEBPage;

  beforeEach(() => {
    page = new SDQRWEBPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
