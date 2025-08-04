import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import Loading from '@/common/components/elements/Loading';

interface SiteSetting {
  id: number;
  key: string;
  value: string;
  description?: string;
  type: string;
}

const SettingsManager = () => {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<SiteSetting>>({
    key: '',
    value: '',
    description: '',
    type: 'string',
  });

  const defaultSettings = [
    {
      key: 'site_name',
      value: 'Sam McNab',
      description: 'Site name',
      type: 'string',
    },
    {
      key: 'site_description',
      value: 'Personal Portfolio',
      description: 'Site description',
      type: 'string',
    },
    {
      key: 'contact_email',
      value: 'admin@sammcnab.co.uk',
      description: 'Contact email',
      type: 'string',
    },
    {
      key: 'github_url',
      value: 'https://github.com/smcnab1',
      description: 'GitHub profile URL',
      type: 'string',
    },
    {
      key: 'linkedin_url',
      value: '',
      description: 'LinkedIn profile URL',
      type: 'string',
    },
    {
      key: 'twitter_url',
      value: '',
      description: 'Twitter profile URL',
      type: 'string',
    },
    {
      key: 'enable_blog',
      value: 'true',
      description: 'Enable blog section',
      type: 'boolean',
    },
    {
      key: 'enable_projects',
      value: 'true',
      description: 'Enable projects section',
      type: 'boolean',
    },
    {
      key: 'enable_contact',
      value: 'true',
      description: 'Enable contact section',
      type: 'boolean',
    },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/cms/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingKey ? 'PUT' : 'POST';
      const url = '/api/cms/settings';
      const body = editingKey ? { ...formData, key: editingKey } : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchSettings();
        resetForm();
        alert(
          editingKey
            ? 'Setting updated successfully!'
            : 'Setting added successfully!',
        );
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      alert('Error saving setting');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (setting: SiteSetting) => {
    setEditingKey(setting.key);
    setFormData(setting);
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this setting?')) return;

    try {
      const response = await fetch(`/api/cms/settings?key=${key}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchSettings();
        alert('Setting deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting setting:', error);
      alert('Error deleting setting');
    }
  };

  const resetForm = () => {
    setEditingKey(null);
    setFormData({
      key: '',
      value: '',
      description: '',
      type: 'string',
    });
  };

  const initializeDefaultSettings = async () => {
    setSaving(true);
    try {
      for (const setting of defaultSettings) {
        await fetch('/api/cms/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(setting),
        });
      }
      await fetchSettings();
      alert('Default settings initialized successfully!');
    } catch (error) {
      console.error('Error initializing settings:', error);
      alert('Error initializing settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Site Settings</h2>
        <div className='flex space-x-2'>
          <Button
            onClick={initializeDefaultSettings}
            disabled={saving}
            className='bg-green-600 hover:bg-green-700 disabled:opacity-50'
          >
            {saving ? 'Initializing...' : 'Initialize Default Settings'}
          </Button>
        </div>
      </div>

      <Card className='p-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Setting Key *
              </label>
              <input
                type='text'
                value={formData.key}
                onChange={(e) =>
                  setFormData({ ...formData, key: e.target.value })
                }
                className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
                disabled={!!editingKey}
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>Type *</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                required
              >
                <option value='string'>String</option>
                <option value='number'>Number</option>
                <option value='boolean'>Boolean</option>
                <option value='json'>JSON</option>
              </select>
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>Value *</label>
              {formData.type === 'boolean' ? (
                <select
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                >
                  <option value=''>Select value</option>
                  <option value='true'>True</option>
                  <option value='false'>False</option>
                </select>
              ) : (
                <input
                  type={formData.type === 'number' ? 'number' : 'text'}
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              )}
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Description
              </label>
              <input
                type='text'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              />
            </div>
          </div>
          <div className='flex space-x-2'>
            <Button
              type='submit'
              disabled={saving}
              className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
            >
              {saving
                ? 'Saving...'
                : editingKey
                  ? 'Update Setting'
                  : 'Add Setting'}
            </Button>
            <Button
              type='button'
              onClick={resetForm}
              className='bg-gray-600 hover:bg-gray-700'
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      <div className='space-y-4'>
        {settings.map((setting) => (
          <Card key={setting.id} className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <h3 className='font-semibold'>{setting.key}</h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {setting.value} ({setting.type})
                </p>
                {setting.description && (
                  <p className='text-sm text-gray-500'>{setting.description}</p>
                )}
              </div>
              <div className='flex space-x-2'>
                <Button
                  onClick={() => handleEdit(setting)}
                  className='bg-blue-600 hover:bg-blue-700'
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(setting.key)}
                  className='bg-red-600 hover:bg-red-700'
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SettingsManager;
