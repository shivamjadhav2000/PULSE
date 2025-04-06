const axios = require('axios');

const getLocationFromIP = async (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    ip = ip.split(',')[0].replace('::ffff:', '').trim();

    // 🚧 Detect development mode (e.g., localhost or private IP)
    const isPrivateIP =
        ip === '127.0.0.1' ||
        ip.startsWith('192.') ||
        ip.startsWith('10.') ||
        ip.startsWith('172.') ||
        ip === '::1';

    // ✅ Mock location in development
    if (isPrivateIP) {
        console.log(`Dev mode IP (${ip}), mocking location...`);
        req.userLocation = {
            lat: 37.7749,  // e.g., San Francisco
            lng: -122.4194
        };
        return next();
    }

    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`);
        if (response.data && !response.data.error) {
            const { latitude: lat, longitude: lng } = response.data;
            req.userLocation = { lat, lng };
        } else {
            console.warn('IPAPI Error:', response.data.reason || 'Unknown reason');
            req.userLocation = { lat: null, lng: null };
        }
    } catch (err) {
        console.error('Error fetching IP location:', err.message);
        req.userLocation = { lat: null, lng: null };
    }

    next();
};

module.exports = getLocationFromIP;
