// Station Photo Mapper - Maps 3D assets to real London Underground photos

// Photo URL helper - tries local first, falls back to placeholder
function getPhotoUrl(filename, fallbackType = 'platform') {
    // Try local image first
    const localUrl = `/images/${filename}`;
    // Fallback to Unsplash placeholder if local not available
    const fallbackUrls = {
        platform: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
        concourse: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?w=1200&q=80',
        tunnel: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=1200&q=80',
        exterior: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80'
    };
    
    return {
        primary: localUrl,
        fallback: fallbackUrls[fallbackType]
    };
}

export const stationPhotos = {
    "King's Cross St. Pancras": {
        name: "King's Cross St. Pancras",
        photoUrl: getPhotoUrl('kings-cross.jpg', 'platform'),
        description: "Major interchange station serving 6 lines",
        coordinates: { lat: 51.5308, lng: -0.1238 },
        assetPositions: {
            platform: { x: 0, y: 0, z: 0 },
            concourse: { x: -5, y: 2, z: -3 }
        }
    },
    "Oxford Circus": {
        name: "Oxford Circus",
        photoUrl: getPhotoUrl('oxford-circus.jpg', 'concourse'),
        description: "Busy shopping district station serving 3 lines",
        coordinates: { lat: 51.5152, lng: -0.1419 },
        assetPositions: {
            platform: { x: 2, y: 0, z: 1 },
            concourse: { x: -3, y: 2, z: -2 }
        }
    },
    "Victoria": {
        name: "Victoria",
        photoUrl: getPhotoUrl('victoria.jpg', 'platform'),
        description: "Major terminus and interchange serving 3 lines",
        coordinates: { lat: 51.4965, lng: -0.1447 },
        assetPositions: {
            platform: { x: 1, y: 0, z: 2 },
            concourse: { x: -4, y: 2, z: 0 }
        }
    },
    "Liverpool Street": {
        name: "Liverpool Street",
        photoUrl: getPhotoUrl('liverpool-street.jpg', 'concourse'),
        description: "City financial district hub serving 4 lines",
        coordinates: { lat: 51.5178, lng: -0.0823 },
        assetPositions: {
            platform: { x: -1, y: 0, z: 1 },
            concourse: { x: 3, y: 2, z: -1 }
        }
    },
    "Waterloo": {
        name: "Waterloo",
        photoUrl: getPhotoUrl('waterloo.jpg', 'platform'),
        description: "Busiest station in the UK serving 4 lines",
        coordinates: { lat: 51.5031, lng: -0.1132 },
        assetPositions: {
            platform: { x: 0, y: 0, z: -2 },
            concourse: { x: -2, y: 2, z: 1 }
        }
    },
    "London Bridge": {
        name: "London Bridge",
        photoUrl: getPhotoUrl('london-bridge.jpg', 'platform'),
        description: "Historic station near the Thames serving 2 lines",
        coordinates: { lat: 51.5049, lng: -0.0863 },
        assetPositions: {
            platform: { x: 2, y: 0, z: 0 },
            concourse: { x: -1, y: 2, z: -2 }
        }
    },
    "Paddington": {
        name: "Paddington",
        photoUrl: getPhotoUrl('paddington.jpg', 'platform'),
        description: "Major terminus for western routes serving 4 lines",
        coordinates: { lat: 51.5154, lng: -0.1755 },
        assetPositions: {
            platform: { x: -2, y: 0, z: 1 },
            concourse: { x: 2, y: 2, z: -1 }
        }
    },
    "Bank": {
        name: "Bank",
        photoUrl: getPhotoUrl('bank.jpg', 'tunnel'),
        description: "Heart of the financial district serving 5 lines",
        coordinates: { lat: 51.5133, lng: -0.0886 },
        assetPositions: {
            platform: { x: 1, y: 0, z: -1 },
            concourse: { x: -3, y: 2, z: 2 }
        }
    },
    "Stratford": {
        name: "Stratford",
        photoUrl: getPhotoUrl('stratford.jpg', 'concourse'),
        description: "Olympic Park and shopping center serving 3 lines",
        coordinates: { lat: 51.5416, lng: -0.0042 },
        assetPositions: {
            platform: { x: 0, y: 0, z: 2 },
            concourse: { x: -4, y: 2, z: -1 }
        }
    },
    "Canary Wharf": {
        name: "Canary Wharf",
        photoUrl: getPhotoUrl('canary-wharf.jpg', 'platform'),
        description: "Modern business district serving 2 lines",
        coordinates: { lat: 51.5051, lng: -0.0197 },
        assetPositions: {
            platform: { x: -1, y: 0, z: 0 },
            concourse: { x: 3, y: 2, z: 1 }
        }
    },
    "Leicester Square": {
        name: "Leicester Square",
        photoUrl: getPhotoUrl('leicester-square.jpg', 'platform'),
        description: "West End entertainment hub serving 2 lines",
        coordinates: { lat: 51.5113, lng: -0.1281 },
        assetPositions: {
            platform: { x: 2, y: 0, z: -1 },
            concourse: { x: -2, y: 2, z: 0 }
        }
    },
    "Piccadilly Circus": {
        name: "Piccadilly Circus",
        photoUrl: getPhotoUrl('piccadilly-circus.jpg', 'concourse'),
        description: "Iconic central London location serving 2 lines",
        coordinates: { lat: 51.5098, lng: -0.1342 },
        assetPositions: {
            platform: { x: 0, y: 0, z: 1 },
            concourse: { x: -3, y: 2, z: -2 }
        }
    },
    "Green Park": {
        name: "Green Park",
        photoUrl: getPhotoUrl('green-park.jpg', 'platform'),
        description: "Royal Parks area station serving 3 lines",
        coordinates: { lat: 51.5067, lng: -0.1428 },
        assetPositions: {
            platform: { x: 1, y: 0, z: 0 },
            concourse: { x: 2, y: 2, z: -1 }
        }
    },
    "Westminster": {
        name: "Westminster",
        photoUrl: getPhotoUrl('westminster.jpg', 'platform'),
        description: "Parliament and government quarter serving 3 lines",
        coordinates: { lat: 51.5010, lng: -0.1246 },
        assetPositions: {
            platform: { x: -2, y: 0, z: 1 },
            concourse: { x: 1, y: 2, z: 2 }
        }
    },
    "Euston": {
        name: "Euston",
        photoUrl: getPhotoUrl('euston.jpg', 'concourse'),
        description: "Major northern terminus serving 2 lines",
        coordinates: { lat: 51.5282, lng: -0.1337 },
        assetPositions: {
            platform: { x: 0, y: 0, z: -1 },
            concourse: { x: -4, y: 2, z: 1 }
        }
    },
    "Camden Town": {
        name: "Camden Town",
        photoUrl: getPhotoUrl('camden-town.jpg', 'platform'),
        description: "Alternative culture district serving 1 line",
        coordinates: { lat: 51.5392, lng: -0.1426 },
        assetPositions: {
            platform: { x: 2, y: 0, z: 0 },
            concourse: { x: -1, y: 2, z: -2 }
        }
    },
    "Clapham Common": {
        name: "Clapham Common",
        photoUrl: getPhotoUrl('clapham-common.jpg', 'platform'),
        description: "South London residential area serving 1 line",
        coordinates: { lat: 51.4615, lng: -0.1384 },
        assetPositions: {
            platform: { x: -1, y: 0, z: 2 },
            concourse: { x: 3, y: 2, z: 0 }
        }
    },
    "Brixton": {
        name: "Brixton",
        photoUrl: getPhotoUrl('brixton.jpg', 'platform'),
        description: "Vibrant multicultural hub serving 1 line",
        coordinates: { lat: 51.4613, lng: -0.1149 },
        assetPositions: {
            platform: { x: 1, y: 0, z: -2 },
            concourse: { x: -2, y: 2, z: 1 }
        }
    },
    "Wembley Park": {
        name: "Wembley Park",
        photoUrl: getPhotoUrl('wembley-park.jpg', 'exterior'),
        description: "Stadium and events venue serving 2 lines",
        coordinates: { lat: 51.5634, lng: -0.2795 },
        assetPositions: {
            platform: { x: 0, y: 0, z: 1 },
            concourse: { x: -3, y: 2, z: -1 }
        }
    },
    "Heathrow Terminal 5": {
        name: "Heathrow Terminal 5",
        photoUrl: getPhotoUrl('heathrow-t5.jpg', 'platform'),
        description: "Airport terminal connection serving 1 line",
        coordinates: { lat: 51.4700, lng: -0.4877 },
        assetPositions: {
            platform: { x: -2, y: 0, z: 0 },
            concourse: { x: 2, y: 2, z: 2 }
        }
    }
};

// Fallback images for different station types
export const fallbackImages = {
    platform: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    concourse: "https://images.unsplash.com/photo-1543716091-a840c05249ec?w=1200&q=80",
    tunnel: "https://images.unsplash.com/photo-1520986606214-8b456906c813?w=1200&q=80",
    exterior: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&q=80"
};

export function getStationPhoto(stationName) {
    return stationPhotos[stationName] || {
        name: stationName,
        photoUrl: fallbackImages.platform,
        description: "London Underground Station",
        coordinates: { lat: 51.5074, lng: -0.1278 },
        assetPositions: {
            platform: { x: 0, y: 0, z: 0 },
            concourse: { x: 0, y: 2, z: 0 }
        }
    };
}

export function getAllStationPhotos() {
    return Object.values(stationPhotos);
}

// Made with Bob
