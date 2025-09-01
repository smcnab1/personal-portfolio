import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import EmptyState from '@/common/components/elements/EmptyState';
import Loading from '@/common/components/elements/Loading';

interface Certification {
  id: number;
  membership: string;
  organisation: string;
  logo?: string;
  type: string;
  start_date: string;
  end_date?: string;
  industry?: string;
  link?: string;
  description: string[];
  isActive: boolean;
  sortOrder: number;
}

const CertificationManager = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Certification>>({
    membership: '',
    organisation: '',
    logo: '',
    type: '',
    start_date: '',
    end_date: '',
    industry: '',
    link: '',
    description: [],
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const response = await fetch('/api/cms/certifications');
      const data = await response.json();
      // Show all certifications for management, sort by start_date (newest first), then by sortOrder
      const sortedCertifications = data.sort(
        (a: Certification, b: Certification) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          if (dateA > dateB) return -1;
          if (dateA < dateB) return 1;
          return a.sortOrder - b.sortOrder;
        },
      );
      setCertifications(sortedCertifications);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/cms/certifications';

      // For new items, set sortOrder to be at the top (lowest number)
      const body = editingId
        ? { ...formData, id: editingId }
        : {
            ...formData,
            sortOrder:
              Math.min(...certifications.map((c) => c.sortOrder), 0) - 1,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchCertifications();
        resetForm();
        alert(
          editingId
            ? 'Certification updated successfully!'
            : 'Certification added successfully!',
        );
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      alert('Error saving certification');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (certification: Certification) => {
    setEditingId(certification.id);
    setFormData(certification);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const response = await fetch(`/api/cms/certifications?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCertifications();
        alert('Certification deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      alert('Error deleting certification');
    }
  };

  const handleHardDelete = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this certification? This action cannot be undone.',
      )
    )
      return;

    try {
      const response = await fetch(
        `/api/cms/certifications?id=${id}&hard=true`,
        {
          method: 'DELETE',
        },
      );

      if (response.ok) {
        await fetchCertifications();
        alert('Certification permanently deleted!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error hard deleting certification:', error);
      alert('Error permanently deleting certification');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      membership: '',
      organisation: '',
      logo: '',
      type: '',
      start_date: '',
      end_date: '',
      industry: '',
      link: '',
      description: [],
      isActive: true,
      sortOrder: 0,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Certification Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-green-600 hover:bg-green-700'
        >
          Add New Certification
        </Button>
      </div>

      {showForm && (
        <Card className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Membership/Certification *
                </label>
                <input
                  type='text'
                  value={formData.membership}
                  onChange={(e) =>
                    setFormData({ ...formData, membership: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Organisation *
                </label>
                <input
                  type='text'
                  value={formData.organisation}
                  onChange={(e) =>
                    setFormData({ ...formData, organisation: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Logo URL
                </label>
                <input
                  type='url'
                  value={formData.logo}
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
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
                  <option value=''>Select type</option>
                  <option value='Membership'>Membership</option>
                  <option value='Certification'>Certification</option>
                  <option value='Qualification'>Qualification</option>
                </select>
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Start Date *
                </label>
                <input
                  type='date'
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  End Date
                </label>
                <input
                  type='date'
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Industry
                </label>
                <input
                  type='text'
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Website
                </label>
                <input
                  type='url'
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Description (JSON)
              </label>
              <textarea
                value={
                  Array.isArray(formData.description)
                    ? JSON.stringify(formData.description, null, 2)
                    : ''
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({ ...formData, description: parsed });
                  } catch {
                    setFormData({ ...formData, description: [] });
                  }
                }}
                className='h-32 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Enter description as JSON array, e.g., ["Description 1", "Description 2"]'
                required
              />
            </div>
            <div className='flex items-center space-x-4'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className='mr-2'
                />
                Active
              </label>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Sort Order
                </label>
                <input
                  type='number'
                  value={formData.sortOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortOrder: parseInt(e.target.value) || 0,
                    })
                  }
                  className='w-20 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
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
                  : editingId
                    ? 'Update Certification'
                    : 'Add Certification'}
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
      )}

      {certifications.length === 0 ? (
        <EmptyState message='No certifications found. Add your first certification to get started.' />
      ) : (
        <div className='space-y-4'>
          {certifications.map((certification) => (
            <Card key={certification.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <h3 className='font-semibold'>
                      {certification.membership}
                    </h3>
                    {!certification.isActive && (
                      <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {certification.organisation}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {certification.start_date} -{' '}
                    {certification.end_date || 'Present'} • {certification.type}
                  </p>
                  {certification.industry && (
                    <p className='text-sm text-gray-500'>
                      {certification.industry}
                    </p>
                  )}
                </div>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => handleEdit(certification)}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(certification.id)}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Delete
                  </Button>
                  {!certification.isActive && (
                    <Button
                      onClick={() => handleHardDelete(certification.id)}
                      className='bg-red-800 hover:bg-red-900'
                      title='Permanently delete this certification'
                    >
                      Hard Delete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificationManager;
