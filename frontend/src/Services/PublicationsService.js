import {fetchBody} from '../utils';

const apiUrl = 'http://annotations.mini.pw.edu.pl/api/annotations'; //'http://localhost:8081/api/annotations'; //

export default class PublicationsService {
  constructor(authService) {
    this.authService = authService;
    this.types = null;
    this.tags = null;
  }

  get headers() {
    return {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",
      'X-AUTH-TOKEN': this.authService.token
    };
  }

  async getPage(publicationId, pageNumber) {
    await this.authService.ensureLoggedIn();
    const publication = await fetchBody(`${apiUrl}/publications/${publicationId}`, {
      headers: this.headers
    });
    const page = await this.getPageData(publicationId, pageNumber);
    return {...publication, page};
  }

  async getPublication(publicationId) {
    await this.authService.ensureLoggedIn();
    const publication = await fetchBody(`${apiUrl}/publications/${publicationId}`, {
      headers: this.headers
    });
    const {count} = await fetchBody(`${apiUrl}/publications/pages`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 1,
        searchCriteria: {
          publicationId
        }
      }),
      headers: this.headers
    });
    return {...publication, pageCount: count};
  }

  async getPublicationPages(publicationId) {
    await this.authService.ensureLoggedIn();
    const {list} = await fetchBody(`${apiUrl}/publications/pages`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: 1,
        pageSize: 100,
        searchCriteria: {
          publicationId
        }
      }),
      headers: this.headers
    });
    list.forEach(el => el.imageUrl = el.imageUrl.replace("http", "https"));
    return list;
  }

  async getPublicationPreviews(pageNumber, searchCriteria) {
    await this.authService.ensureLoggedIn();
    const {list: publications} = await fetchBody(`${apiUrl}/publications`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber,
        pageSize: 8,
        searchCriteria
      }),
      headers: this.headers
    });
    const imagesSrc = await Promise.all(publications.map(({id}) => this.getPageData(id, 1)));
    return publications.map((page, ind) => ({...page, src: imagesSrc[ind].imageUrl}));
  }

  async getPageData(publicationId, pageNumber) {
    await this.authService.ensureLoggedIn();
    const {list} = await fetchBody(`${apiUrl}/publications/pages`, {
      method: 'POST',
      body: JSON.stringify({
        pageNumber: pageNumber,
        pageSize: 1,
        searchCriteria: {
          publicationId
        }
      }),
      headers: this.headers
    });
    if (list && list.length > 0) {
      list[0].imageUrl = list[0].imageUrl.replace("http", "https");
      return list[0];
    }
    return '';
  }

  async getOcrData(publicationId, pageNumber) {
    await this.authService.ensureLoggedIn();
    const data = await fetchBody(`${apiUrl}/publications/ocr`, {
      method: 'POST',
      body: JSON.stringify({
        publication_id: publicationId,
        page: pageNumber
      }),
      headers: this.headers
    });
    return data.results[0].ocr;
  }

  async getTypes() {
    await this.authService.ensureLoggedIn();
    if(this.types == null){
      this.types = await fetchBody(`${apiUrl}/publications/object-types`, {
        headers: this.headers
      });
    }
    
    return this.types;
  }

  async getTags() {
    await this.authService.ensureLoggedIn();
    if(this.tags == null){
      this.tags = await fetchBody(`${apiUrl}/publications/annotation-tags`, {
        headers: this.headers
      });
      /*availableTags = [
          {id: 1, name: "To discuss", value: "to_discuss"},
          {id: 2, name: "Hard case", value: "hard_case"},
          {id: 3, name: "Multiple items", value: "multiple_items"}
        ]; */
    }
    
    return this.tags;
  }
}
