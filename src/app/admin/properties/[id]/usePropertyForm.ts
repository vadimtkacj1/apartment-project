import { useState, useEffect } from 'react';
import { message } from 'antd';
import { FormInstance } from 'antd';
import { PropertyForm } from './types';
import { INITIAL_FORM } from './constants';

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
        setFormData(data);
        form.setFieldsValue(data);
      }
    } catch (err) {
      message.error('שגיאה בטעינת הנכס');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PropertyForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (values: any, onSuccess?: () => void) => {
    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/properties'
        : `/api/admin/properties/${propertyId}`;

      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...values }),
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        message.success('הנכס נשמר בהצלחה');
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } else {
        const errorMessage =
          responseData.error || responseData.message || 'שגיאה בשמירת הנכס';
        message.error(errorMessage);
      }
    } catch (err: any) {
      message.error(err.message || 'שגיאה בשמירת הנכס');
    } finally {
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
