const prod = process.env.NODE_ENV === 'production'

module.exports = {
    'process.env.BACKEND_URL': prod ? 'http://54.234.121.156/' : 'http://54.234.121.156/'
}