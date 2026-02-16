import { NextRequest, NextResponse } from 'next/server';

// Helper function to add delay between Nominatim requests (respect rate limiting)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Validate coordinates are within Israel bounds
// Israel approximate bounds: lat 29.5-33.3, lng 34.2-35.8
function isValidIsraelCoordinates(lat: number, lng: number): boolean {
  // Basic validation
  if (isNaN(lat) || isNaN(lng)) return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;
  
  // Israel-specific bounds (with some margin for edge cases)
  const isWithinIsrael = lat >= 29 && lat <= 33.5 && lng >= 34 && lng <= 36;
  
  // Check if coordinates might be swapped (common error)
  const mightBeSwapped = (lng >= 29 && lng <= 33.5 && lat >= 34 && lat <= 36);
  
  if (mightBeSwapped && !isWithinIsrael) {
    console.log(`Coordinates might be swapped: lat=${lat}, lng=${lng}`);
    return false; // Will be handled by swap detection
  }
  
  return isWithinIsrael;
}

// Fix swapped coordinates (lat/lng swapped)
function fixSwappedCoordinates(lat: number, lng: number): { lat: number; lng: number } | null {
  // If coordinates are swapped, swap them back
  if (lng >= 29 && lng <= 33.5 && lat >= 34 && lat <= 36) {
    console.log(`Fixing swapped coordinates: ${lat},${lng} -> ${lng},${lat}`);
    return { lat: lng, lng: lat };
  }
  return null;
}

// Get address information from Israeli postal service API by postal code
async function getAddressByZip(zip: string): Promise<{ city: string; street?: string; houseNumber?: string } | null> {
  try {
    const normalizedZip = zip.replace(/[\s-]/g, '').trim();

    // Israeli postal codes are typically 5 or 7 digits
    if (!/^\d{5,7}$/.test(normalizedZip)) {
      return null;
    }

    // Try to get address from Israeli postal service API
    const response = await fetch(
      `https://www.israelpost.co.il/zip_data.nsf/SearchZip?OpenAgent&Zip=${normalizedZip}`,
      {
        headers: {
          'User-Agent': 'ApartmentProject/1.0',
          'Accept': 'application/json, text/html'
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type');

    // Try JSON first
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      if (data && (data.city || data.place)) {
        return {
          city: data.city || data.place || '',
          street: data.street || '',
          houseNumber: data.houseNumber || ''
        };
      }
    } else {
      // Parse HTML response
      const html = await response.text();
      const cityMatch = html.match(/Location[^>]*>([^<]+)</i) || html.match(/יישוב[^>]*>([^<]+)</i);
      const streetMatch = html.match(/Street[^>]*>([^<]+)</i) || html.match(/רחוב[^>]*>([^<]+)</i);
      const houseMatch = html.match(/House[^>]*>([^<]+)</i) || html.match(/בית[^>]*>([^<]+)</i);

      if (cityMatch) {
        return {
          city: cityMatch[1]?.trim() || '',
          street: streetMatch?.[1]?.trim() || '',
          houseNumber: houseMatch?.[1]?.trim() || ''
        };
      }
    }

    return null;
  } catch (error) {
    console.log('Israel Post API error:', error);
    return null;
  }
}

// Get coordinates using address from Israeli postal service
async function getCoordsByZip(zip: string): Promise<{ city: string; lat: number; lng: number } | null> {
  try {
    // First, try to get address from Israeli postal service
    const addressData = await getAddressByZip(zip);
    
    if (!addressData || !addressData.city) {
      return null;
    }
    
    // Build full address string
    const addressParts = [];
    if (addressData.street) addressParts.push(addressData.street);
    if (addressData.houseNumber) addressParts.push(addressData.houseNumber);
    addressParts.push(addressData.city);
    addressParts.push('Israel');
    
    const fullAddress = addressParts.join(', ');
    
    // Use Nominatim to geocode the address
    const headers = {
      'User-Agent': 'ApartmentProject/1.0 (Real Estate App)',
      'Accept-Language': 'he,en'
    };
    
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&addressdetails=1&limit=1&accept-language=he`,
      { headers }
    );
    
    if (!geoResponse.ok) {
      return null;
    }
    
    const geoData = await geoResponse.json();
    
    if (Array.isArray(geoData) && geoData.length > 0) {
      const result = geoData[0];
      let lat = parseFloat(result.lat);
      let lng = parseFloat(result.lon);
      
      // Validate coordinates
      if (isNaN(lat) || isNaN(lng)) {
        return null;
      }
      
      // Check if coordinates are swapped and fix them
      const fixedCoords = fixSwappedCoordinates(lat, lng);
      if (fixedCoords) {
        lat = fixedCoords.lat;
        lng = fixedCoords.lng;
      }
      
      // Validate coordinates are within Israel
      if (!isValidIsraelCoordinates(lat, lng)) {
        return null;
      }
      
      return {
        city: addressData.city,
        lat: lat,
        lng: lng
      };
    }
    
    return null;
  } catch (error) {
    console.log('Error getting coordinates by zip:', error);
    return null;
  }
}

// GET geocoding results using free Nominatim (OpenStreetMap)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const postalCode = searchParams.get('postalCode');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // Check if this is a reverse geocoding request (coordinates to address)
    const isReverseGeocode = lat && lng;

    if (!address && !postalCode && !isReverseGeocode) {
      return NextResponse.json(
        { error: 'Either address, postalCode, or lat/lng is required' },
        { status: 400 }
      );
    }

    let nominatimUrl: string;
    const headers = {
      'User-Agent': 'ApartmentProject/1.0 (Real Estate App)',
      'Accept-Language': 'he,en'
    };

    if (isReverseGeocode) {
      // Reverse geocoding (coordinates to address)
      nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&accept-language=he`;
    } else if (postalCode) {
      // First, try to get address from Israeli postal service API, then geocode it
      const zipCoords = await getCoordsByZip(postalCode);
      
      if (zipCoords) {
        // Successfully got coordinates from Israeli postal service + Nominatim
        const result = {
          formatted: `${zipCoords.city}, ישראל`,
          lat: zipCoords.lat,
          lng: zipCoords.lng,
          city: zipCoords.city,
          street: '',
          streetNumber: '',
          neighborhood: '',
          postcode: postalCode
        };

        return NextResponse.json({
          success: true,
          results: [result]
        });
      }

      // Fallback to Nominatim with improved search strategies
      const normalizedPostalCode = postalCode.replace(/[\s-]/g, '').trim();
      
      // Strategy 1: Search by full postal code with country
      nominatimUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(normalizedPostalCode)}&country=Israel&format=json&addressdetails=1&limit=5&accept-language=he`;
    } else {
      // Forward geocoding (address to coordinates)
      const searchQuery = address!.includes('Israel') || address!.includes('ישראל')
        ? address!
        : `${address}, Israel`;
      nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery!)}&format=json&addressdetails=1&limit=5&accept-language=he`;
    }

    console.log('Nominatim URL:', nominatimUrl);

    let response: Response;
    let data: any;
    
    try {
      response = await fetch(nominatimUrl, { headers });
      data = await response.json();
      console.log('Nominatim response:', data);
    } catch (fetchError) {
      console.error('Nominatim fetch error:', fetchError);
      return NextResponse.json({
        success: false,
        results: [],
        error: 'Failed to connect to geocoding service'
      });
    }
    
    // If postal code search failed and we have a postal code, try multiple alternative strategies
    if (postalCode && Array.isArray(data) && data.length === 0) {
      const normalizedPostalCode = postalCode.replace(/[\s-]/g, '').trim();
      
      // Strategy 2: Search without country restriction (sometimes Nominatim is too strict)
      console.log(`Trying search without country restriction for: ${normalizedPostalCode}`);
      await delay(500); // Rate limiting delay
      try {
        const noCountryUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(normalizedPostalCode)}&format=json&addressdetails=1&limit=5&accept-language=he`;
        const noCountryResponse = await fetch(noCountryUrl, { headers });
        const noCountryData = await noCountryResponse.json();
        if (Array.isArray(noCountryData) && noCountryData.length > 0) {
          // Filter results to only include Israel
          const israelResults = noCountryData.filter((item: any) => {
            const country = item.address?.country || item.address?.country_code?.toUpperCase();
            return country === 'IL' || country === 'ישראל' || country === 'Israel';
          });
          if (israelResults.length > 0) {
            console.log(`Found ${israelResults.length} results without country restriction`);
            data = israelResults;
          }
        }
      } catch (altError) {
        console.log('Search without country failed:', altError);
      }
      
      // Strategy 3: Try searching with formatted postal code (7 digits: 5810201 -> 58102-01)
      if (data.length === 0 && normalizedPostalCode.length === 7) {
        const formattedCode = `${normalizedPostalCode.substring(0, 5)}-${normalizedPostalCode.substring(5)}`;
        console.log(`Trying formatted postal code: ${formattedCode}`);
        await delay(500); // Rate limiting delay
        try {
          const formattedUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(formattedCode)}&format=json&addressdetails=1&limit=5&accept-language=he`;
          const formattedResponse = await fetch(formattedUrl, { headers });
          const formattedData = await formattedResponse.json();
          if (Array.isArray(formattedData) && formattedData.length > 0) {
            const israelResults = formattedData.filter((item: any) => {
              const country = item.address?.country || item.address?.country_code?.toUpperCase();
              return country === 'IL' || country === 'ישראל' || country === 'Israel';
            });
            if (israelResults.length > 0) {
              console.log(`Found ${israelResults.length} results with formatted code`);
              data = israelResults;
            }
          }
        } catch (altError) {
          console.log('Formatted code search failed:', altError);
        }
      }
      
      // Strategy 4: Try searching by first 5 digits (main postal code area)
      if (data.length === 0 && normalizedPostalCode.length >= 5) {
        const prefix5 = normalizedPostalCode.substring(0, 5);
        console.log(`Trying search with 5-digit prefix: ${prefix5}`);
        await delay(500); // Rate limiting delay
        try {
          const prefixUrl = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(prefix5)}&format=json&addressdetails=1&limit=5&accept-language=he`;
          const prefixResponse = await fetch(prefixUrl, { headers });
          const prefixData = await prefixResponse.json();
          if (Array.isArray(prefixData) && prefixData.length > 0) {
            const israelResults = prefixData.filter((item: any) => {
              const country = item.address?.country || item.address?.country_code?.toUpperCase();
              return country === 'IL' || country === 'ישראל' || country === 'Israel';
            });
            if (israelResults.length > 0) {
              console.log(`Found ${israelResults.length} results with 5-digit prefix`);
              data = israelResults;
            }
          }
        } catch (altError) {
          console.log('Prefix search failed:', altError);
        }
      }
      
      // Strategy 5: Try searching as a general address query (maybe it's not a postal code format)
      if (data.length === 0) {
        console.log(`Trying search as address query: ${normalizedPostalCode}`);
        await delay(500); // Rate limiting delay
        try {
          const addressUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(`${normalizedPostalCode} Israel`)}&format=json&addressdetails=1&limit=5&accept-language=he`;
          const addressResponse = await fetch(addressUrl, { headers });
          const addressData = await addressResponse.json();
          if (Array.isArray(addressData) && addressData.length > 0) {
            const israelResults = addressData.filter((item: any) => {
              const country = item.address?.country || item.address?.country_code?.toUpperCase();
              const postcode = item.address?.postcode || '';
              return (country === 'IL' || country === 'ישראל' || country === 'Israel') &&
                     (postcode.includes(normalizedPostalCode) || normalizedPostalCode.includes(postcode.replace(/[\s-]/g, '')));
            });
            if (israelResults.length > 0) {
              console.log(`Found ${israelResults.length} results as address query`);
              data = israelResults;
            }
          }
        } catch (altError) {
          console.log('Address query search failed:', altError);
        }
      }
    }

    // Handle reverse geocoding response (single object)
    if (isReverseGeocode && data && data.lat && data.lon) {
      let lat = parseFloat(data.lat);
      let lng = parseFloat(data.lon);
      
      // Check if coordinates are swapped and fix them
      const fixedCoords = fixSwappedCoordinates(lat, lng);
      if (fixedCoords) {
        lat = fixedCoords.lat;
        lng = fixedCoords.lng;
      }
      
      // Validate coordinates for Israel (only if postal code search)
      if (postalCode && !isValidIsraelCoordinates(lat, lng)) {
        console.log(`Nominatim coordinates outside Israel bounds: lat=${lat}, lng=${lng}`);
        return NextResponse.json({
          success: false,
          results: [],
          error: `Postal code ${postalCode} returned coordinates outside Israel`
        });
      }
      
      const result = {
        formatted: data.display_name || '',
        lat: lat,
        lng: lng,
        city: data.address?.city || data.address?.town || data.address?.village || '',
        street: data.address?.road || '',
        streetNumber: data.address?.house_number || '',
        neighborhood: data.address?.suburb || data.address?.neighbourhood || '',
        postcode: data.address?.postcode || ''
      };

      return NextResponse.json({
        success: true,
        results: [result]
      });
    }

    // Handle forward geocoding response (array)
    if (Array.isArray(data) && data.length > 0) {
      const results = data
        .map((item: any) => {
          let lat = parseFloat(item.lat);
          let lng = parseFloat(item.lon);
          
          // Check if coordinates are swapped and fix them
          const fixedCoords = fixSwappedCoordinates(lat, lng);
          if (fixedCoords) {
            lat = fixedCoords.lat;
            lng = fixedCoords.lng;
          }
          
          return {
            formatted: item.display_name || '',
            lat: lat,
            lng: lng,
            city: item.address?.city || item.address?.town || item.address?.village || '',
            street: item.address?.road || '',
            streetNumber: item.address?.house_number || '',
            neighborhood: item.address?.suburb || item.address?.neighbourhood || '',
            postcode: item.address?.postcode || postalCode || ''
          };
        })
        // Filter out results outside Israel bounds if this is a postal code search
        .filter((result: any) => {
          if (postalCode) {
            const isValid = isValidIsraelCoordinates(result.lat, result.lng);
            if (!isValid) {
              console.log(`Filtering out result outside Israel: lat=${result.lat}, lng=${result.lng}`);
            }
            return isValid;
          }
          return true; // Keep all results for address searches
        });

      if (results.length === 0) {
        return NextResponse.json({
          success: false,
          results: [],
          error: `Postal code ${postalCode} not found or returned invalid coordinates`
        });
      }

      return NextResponse.json({
        success: true,
        results
      });
    }

    // No results found from any source
    let errorMessage: string;
    if (postalCode) {
      const normalizedPostalCode = postalCode.replace(/[\s-]/g, '').trim();
      errorMessage = `מיקוד ${normalizedPostalCode} לא נמצא במערכת. נסה:\n` +
        `• הזן כתובת מלאה במקום מיקוד\n` +
        `• לחץ על המפה לבחירת מיקום ידנית\n` +
        `• בדוק שהמיקוד נכון (5 או 7 ספרות)`;
    } else if (address) {
      errorMessage = `הכתובת "${address}" לא נמצאה`;
    } else {
      errorMessage = 'לא נמצאו תוצאות';
    }
    
    return NextResponse.json({
      success: false,
      results: [],
      error: errorMessage
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      { error: 'Failed to geocode address', success: false },
      { status: 500 }
    );
  }
}
