import { useState, useEffect } from 'react';
import { toast } from '@/components/shadcn/sonner';
import { useUnsavedChangesWarning } from '@/hooks/useUnsavedChangesWarning';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
import { PropertyForm } from './types';
import { INITIAL_FORM } from './constants';
import { getCityLabel, getCitySlug } from '@/data/cities';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function usePropertyForm(
  propertyId: string | string[] | undefined,
  isNew: boolean
) {
  const t = useAdminMessages(propertyFormMessages);
  const [formData, setFormData] = useState<PropertyForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  // Warn before leaving the page with unsaved edits.
  const [dirty, setDirty] = useState(false);
  useUnsavedChangesWarning(dirty);

  useEffect(() => {
    if (!isNew) {
      fetchProperty();
    }
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (response.ok) {
        const data = await response.json();

        // Convert agentIds to new format if needed (backward compatibility)
        let agentIds = data.agentIds || [];
        if (agentIds.length > 0 && typeof agentIds[0] === 'number') {
          // Old format: convert numbers to "team-X" format
          agentIds = agentIds.map((id: number) => `team-${id}`);
        }

        // Keep vacancyDate as string in formData for API submission.
        setFormData({
          ...data,
          vacancyDate: data.vacancyDate || null,
          agentIds,
        });
      }
    } catch (err) {
      toast.error(t.feedback.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof PropertyForm, value: any) => {
    setDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'city' || field === 'neighborhood') {
        const cityLabel = getCityLabel(updated.city) || updated.city;
        const parts = [cityLabel, updated.neighborhood].filter(Boolean);
        updated.location = parts.join(', ');
      }
      return updated;
    });
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    setSaving(true);

    try {
      const url = isNew
        ? '/api/admin/properties'
        : `/api/admin/properties/${propertyId}`;

      const method = isNew ? 'POST' : 'PUT';

      // Convert vacancyDate to string if it's a dayjs object
      const submitData: any = { ...formData };
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
        setDirty(false);
        toast.success(t.feedback.saveSuccess);
        if (onSuccess) {
          // Keep saving=true until redirect to prevent double submission
          setTimeout(onSuccess, 1500);
          return;
        }
        setSaving(false);
      } else {
        const errorMessage =
          responseData.error || responseData.message || t.feedback.saveError;
        toast.error(errorMessage);
        setSaving(false);
      }
    } catch (err: any) {
      toast.error(err.message || t.feedback.saveError);
      setSaving(false);
    }
  };

  const handleAddressFromMap = (address: any) => {
    // Auto-fill address fields from map geocoding
    if (address.city) {
      handleChange('city', getCitySlug(address.city));
    }

    if (address.street) {
      handleChange('street', address.street);
    }

    if (address.streetNumber) {
      handleChange('streetNumber', address.streetNumber);
    }

    if (address.neighborhood) {
      handleChange('neighborhood', address.neighborhood);
    }

    // Auto-generate location display
    const locationParts = [address.city, address.neighborhood].filter(Boolean);
    if (locationParts.length > 0) {
      handleChange('location', locationParts.join(', '));
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
