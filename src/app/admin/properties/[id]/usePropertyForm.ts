import { useState, useEffect } from 'react';
import { message } from 'antd';
import { FormInstance } from 'antd';
import { PropertyForm } from './types';
import { INITIAL_FORM, CITY_OPTIONS } from './constants';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function usePropertyForm(
  propertyId: string | string[] | undefined,
  isNew: boolean,
  form: FormInstance
) {
  const [formData, setFormData] = useState<PropertyForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`);
      if (response.ok) {
        const data = await response.json();

        // Convert vacancyDate string to dayjs object if it exists
        // Handle different date formats and "מיד" (immediately) value
        let vacancyDateValue: any = null;
        if (data.vacancyDate) {
          if (data.vacancyDate === 'מיד' || data.vacancyDate === 'immediately') {
            vacancyDateValue = 'מיד';
          } else {
            // Try different date formats
            try {
              // Try DD/MM/YYYY format first
              const parsed = dayjs(data.vacancyDate, 'DD/MM/YYYY', true);
              if (parsed.isValid()) {
                vacancyDateValue = parsed;
              } else {
                // Try ISO format
                const isoParsed = dayjs(data.vacancyDate);
                if (isoParsed.isValid()) {
                  vacancyDateValue = isoParsed;
                } else {
                  // If all parsing fails, keep as string
                  vacancyDateValue = data.vacancyDate;
                }
              }
            } catch (e) {
              console.warn('Failed to parse date:', data.vacancyDate, e);
              vacancyDateValue = data.vacancyDate;
            }
          }
        }
        
        const formValues = {
          ...data,
          vacancyDate: vacancyDateValue,
        };

        // Keep vacancyDate as string in formData for API submission
        setFormData({
          ...data,
          vacancyDate: data.vacancyDate || null
        });
        form.setFieldsValue(formValues);
      }
    } catch (err) {
      message.error('שגיאה בטעינת הנכס');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PropertyForm, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'city' || field === 'neighborhood') {
        const cityLabel = CITY_OPTIONS.find((c) => c.value === updated.city)?.label || updated.city;
        const parts = [cityLabel, updated.neighborhood].filter(Boolean);
        updated.location = parts.join(', ');
      }
      return updated;
    });
  };

  const handleSubmit = async (values: any, onSuccess?: () => void) => {
    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/properties'
        : `/api/admin/properties/${propertyId}`;

      const method = isNew ? 'POST' : 'PUT';

      // Convert vacancyDate to string if it's a dayjs object
      const submitData = { ...formData, ...values };
      if (submitData.vacancyDate && typeof submitData.vacancyDate === 'object' && dayjs.isDayjs(submitData.vacancyDate)) {
        submitData.vacancyDate = submitData.vacancyDate.format('DD/MM/YYYY');
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        message.success('הנכס נשמר בהצלחה');
        if (onSuccess) {
          // Keep saving=true until redirect to prevent double submission
          setTimeout(onSuccess, 1500);
          return;
        }
        setSaving(false);
      } else {
        const errorMessage =
          responseData.error || responseData.message || 'שגיאה בשמירת הנכס';
        message.error(errorMessage);
        setSaving(false);
      }
    } catch (err: any) {
      message.error(err.message || 'שגיאה בשמירת הנכס');
      setSaving(false);
    }
  };

  // Map city names from OpenStreetMap to our format
  const mapCityName = (cityName: string): string => {
    const cityMap: { [key: string]: string } = {
      'חולון': 'holon',
      'Holon': 'holon',
      'בת ים': 'batyam',
      'Bat Yam': 'batyam',
      'ראשון לציון': 'rishon',
      'Rishon LeZion': 'rishon',
      'תל אביב': 'telaviv',
      'Tel Aviv': 'telaviv',
      'Tel Aviv-Yafo': 'telaviv',
    };

    return cityMap[cityName] || cityName.toLowerCase();
  };

  const handleAddressFromMap = (address: any) => {
    // Auto-fill address fields from map geocoding
    if (address.city) {
      const mappedCity = mapCityName(address.city);
      handleChange('city', mappedCity);
      form.setFieldValue('city', mappedCity);
    }

    if (address.street) {
      handleChange('street', address.street);
      form.setFieldValue('street', address.street);
    }

    if (address.streetNumber) {
      handleChange('streetNumber', address.streetNumber);
      form.setFieldValue('streetNumber', address.streetNumber);
    }

    if (address.neighborhood) {
      handleChange('neighborhood', address.neighborhood);
      form.setFieldValue('neighborhood', address.neighborhood);
    }

    // Auto-generate location display
    const locationParts = [address.city, address.neighborhood].filter(Boolean);
    if (locationParts.length > 0) {
      const locationStr = locationParts.join(', ');
      handleChange('location', locationStr);
      form.setFieldValue('location', locationStr);
    }
  };

  return {
    formData,
    loading,
    saving,
    handleChange,
    handleSubmit,
    handleAddressFromMap,
  };
}
