import axios from 'axios'

/**
 * CLASSE FOR RESOURCES
 */
export class Resources {
  /**
   * Construct
   * @param {String} baseUrl
   */
  constructor (baseUrl) {
    this.baseUrl = baseUrl
    this.http = axios.create()
  }

  /**
   * GET ALL RECORDS
   * @param {Object} opts
   */
  fetchAll (opts) {
    return this.http.get(this.baseUrl, opts)
  }

  /**
   * GET ITEM BY ID
   * @param {String} id
   */
  getById (id) {
    return this.http.get(`${this.baseUrl}/${id}`)
  }

  /**
   * SAVA A RESOURCE
   * @param {Object} data
   */
  save (data) {
    return this.http.post(`${this.baseUrl}`, data)
  }

  /**
   * UPDATE A RESROUCE
   * @param {Object} data
   * @param {String} id
   */
  update (data, id) {
    return this.http.put(`${this.baseUrl}/${id}`, data)
  }
}
