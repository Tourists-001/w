const httpRequest = require('../utils/request')

module.exports.addTravelRank = async function (data) {
  return await httpRequest('POST', '/travel', data)
}


module.exports.getRundata = async function (data) {
  console.log(data);
  return await httpRequest('POST', '/travel/run_data', data)
}

module.exports.getTravelRank = async function () {
  return await httpRequest('GET', '/travel', {})
}

module.exports.addTravelLog = async function (data) {
  return await httpRequest('POST', '/travel/travel_log', data)
}

module.exports.getTravelLog = async function (page = 1, limit = 5) {
  return await httpRequest('GET', `/travel/travel_log?page=${page}&limit=${limit}`, {})
}

module.exports.getStepData = async function() {
  return await httpRequest('GET', '/travel/step_num', {})
}