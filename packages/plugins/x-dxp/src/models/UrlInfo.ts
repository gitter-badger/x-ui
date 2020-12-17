
export class UrlInfo {

  constructor(currentUrl: string) {

    const urlsParams: {[key: string]: any } = {};
    const a = document.createElement('a');
    a.href = currentUrl;

    const urlSearchArr = a.search.substring(1).split('&');

    urlSearchArr.forEach(parameter => {
      const pair = parameter.split('=');
      const key = decodeURI(pair[0]);
      let value: string | number | boolean = decodeURI(pair[1]);

      if (value.match(/^\d+$/)) {
        value = parseInt(value, 10);
      } else if (value.match(/^\d+\.\d+$/)) {
        value = parseFloat(value);
      }

      if (urlsParams[key] === undefined) {
        urlsParams[key] = value;
      } else if (typeof value === 'string') {
        urlsParams[key] = [urlsParams[key], value];
      } else {
        urlsParams[key].push(value);
      }
    });

    this.protocol = a.protocol;
    this.hostname = a.hostname;
    this.host = a.host;
    this.port = a.port;
    this.hash = a.hash.substr(1);
    this.pathname = a.pathname;
    this.search = a.search;
    this.parameters = urlsParams;
  }


  protocol: string;
  hostname: string;
  host: string;
  port: string;
  hash: string;
  pathname: string;
  search: string;
  parameters: { [key: string]: string };
}
