// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  return {
    statusCode: 200,
    headers: {'set-cookie': ['accessToken=null']},
    body: JSON.stringify({authenticated: false})
  }
}

module.exports = {handler}
