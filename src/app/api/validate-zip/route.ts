import { NextRequest, NextResponse } from 'next/server';

// Validate zip code using Israeli postal service API
// This uses the official Israel Post API endpoint
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const zipCode = searchParams.get('zip');

    if (!zipCode) {
      return NextResponse.json(
        { error: 'Zip code is required', success: false },
        { status: 400 }
      );
    }

    // Normalize zip code (remove spaces and dashes)
    const normalizedZip = zipCode.replace(/[\s-]/g, '').trim();

    // Validate format (Israeli postal codes are 5 or 7 digits)
    if (!/^\d{5,7}$/.test(normalizedZip)) {
      return NextResponse.json(
        {
          error: 'Invalid zip code format. Israeli postal codes must be 5 or 7 digits',
          success: false
        },
        { status: 400 }
      );
    }

    // Use the official Israeli postal service API
    try {
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
        return NextResponse.json(
          {
            error: `Zip code ${normalizedZip} not found`,
            success: false
          },
          { status: 404 }
        );
      }

      const contentType = response.headers.get('content-type');
      let data: any;

      // Parse response based on content type
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        // Parse HTML response
        const html = await response.text();

        // Extract data from HTML response (Israel Post returns HTML)
        const cityMatch = html.match(/Location[^>]*>([^<]+)</i) || html.match(/יישוב[^>]*>([^<]+)</i);
        const streetMatch = html.match(/Street[^>]*>([^<]+)</i) || html.match(/רחוב[^>]*>([^<]+)</i);
        const houseMatch = html.match(/House[^>]*>([^<]+)</i) || html.match(/בית[^>]*>([^<]+)</i);

        if (cityMatch) {
          return NextResponse.json({
            success: true,
            data: {
              zip: normalizedZip,
              city: cityMatch[1]?.trim() || '',
              street: streetMatch?.[1]?.trim() || '',
              houseNumber: houseMatch?.[1]?.trim() || '',
              region: '',
              area: '',
            }
          });
        }
      }

      // If JSON response, parse it
      if (data && (data.city || data.place || data.name)) {
        return NextResponse.json({
          success: true,
          data: {
            zip: normalizedZip,
            city: data.city || data.place || data.name || '',
            street: data.street || data.road || '',
            houseNumber: data.houseNumber || data.house_number || '',
            region: data.region || '',
            area: data.area || '',
          }
        });
      }

      // Fallback to geocode API
      try {
        const baseUrl = request.nextUrl.origin;
        const geocodeResponse = await fetch(
          `${baseUrl}/api/geocode?postalCode=${normalizedZip}`
        );

        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();

          if (geocodeData.success && geocodeData.results?.length > 0) {
            const result = geocodeData.results[0];
            return NextResponse.json({
              success: true,
              data: {
                zip: normalizedZip,
                city: result.city || '',
                street: result.street || '',
                houseNumber: result.streetNumber || '',
                region: result.neighborhood || '',
                area: '',
              }
            });
          }
        }
      } catch (geocodeError) {
        console.log('Geocode fallback failed:', geocodeError);
      }

      return NextResponse.json(
        {
          error: `Zip code ${normalizedZip} not found or invalid response`,
          success: false
        },
        { status: 404 }
      );
    } catch (apiError: any) {
      console.error('Israel Postal Service API error:', apiError);

      return NextResponse.json(
        {
          error: `Failed to validate zip code: ${apiError.message || 'Unknown error'}`,
          success: false
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Zip validation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to validate zip code',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

