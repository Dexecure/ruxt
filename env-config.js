const prod = process.env.NODE_ENV === 'production'

module.exports = {
    'process.env.BACKEND_URL': prod ? 'https://ruxt-api.dexecure.com/' : 'http://54.234.121.156/'
}