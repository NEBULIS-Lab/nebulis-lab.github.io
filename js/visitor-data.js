// Natural Earth 1 projection, from d3-geo.
// See visitor-projection-LICENSE.txt for the ISC license and attribution.
// Scale and translation match image/visitor-world.svg exactly.
export function naturalEarthPoint(longitude, latitude) {
    if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || Math.abs(longitude) > 180 || Math.abs(latitude) > 90) return null;
    const x = longitude * Math.PI / 180;
    const y = latitude * Math.PI / 180;
    const y2 = y * y;
    const y4 = y2 * y2;
    const rawX = x * (.8707 - .131979 * y2 + y4 * (y4 * (.003971 * y2 - .001529 * y4) - .013791));
    const rawY = y * (1.007226 + y2 * (.015085 + y4 * (.028874 * y2 - .044475 - .005916 * y4)));
    return [360 + 128.76895163286446 * rawX, 203.11529332789246 - 128.76895163286446 * rawY];
}

export function pagePath(href) {
    const path = new URL(href).pathname;
    return path.length <= 256 ? path : null;
}

export function normalizeStatistics(value) {
    const count = number => Number.isSafeInteger(number) && number >= 0;
    if (!value || !count(value.views) || !count(value.countries) || value.countries > value.views || !Array.isArray(value.locations) || value.locations.length > 1000) throw new Error('Invalid statistics');
    const startedAt = value.startedAt;
    if (startedAt !== null && (typeof startedAt !== 'string' || !Number.isFinite(Date.parse(startedAt)))) throw new Error('Invalid start date');
    if (value.views > 0 && !startedAt) throw new Error('Missing start date');
    const locations = value.locations.map(location => {
        if (!location || !/^[A-Z]{2}$/.test(location.country) || typeof location.city !== 'string' || !count(location.views) || location.views === 0 || location.views > value.views || !naturalEarthPoint(location.longitude, location.latitude)) throw new Error('Invalid location');
        return {country:location.country, city:location.city.slice(0, 80), latitude:location.latitude, longitude:location.longitude, views:location.views};
    });
    return {views:value.views, countries:value.countries, startedAt, locations};
}
