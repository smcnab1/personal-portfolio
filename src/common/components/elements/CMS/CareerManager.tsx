import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import EmptyState from '@/common/components/elements/EmptyState';
import Loading from '@/common/components/elements/Loading';

interface Career {
  id: number;
  position: string;
  company: string;
  company_legal_name?: string;
  logo?: string;
  location: string;
  location_type?: string;
  type: string;
  start_date: string;
  end_date?: string;
  industry?: string;
  link?: string;
  responsibilities: string[];
  isActive: boolean;
  sortOrder: number;
}

const CareerManager = () => {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Career>>({
    position: '',
    company: '',
    company_legal_name: '',
    logo: '',
    location: '',
    location_type: '',
    type: '',
    start_date: '',
    end_date: '',
    industry: '',
    link: '',
    responsibilities: [],
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchCareers();
  }, []);

  const fetchCareers = async () => {
    try {
      const response = await fetch('/api/cms/careers');
      const data = await response.json();
      // Show all careers for management, sort by start_date (newest first), then by sortOrder
      const sortedCareers = data.sort((a: Career, b: Career) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return a.sortOrder - b.sortOrder;
      });
      setCareers(sortedCareers);
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/cms/careers';

      // For new items, set sortOrder to be at the top (lowest number)
      const body = editingId
        ? { ...formData, id: editingId }
        : {
            ...formData,
            sortOrder: Math.min(...careers.map((c) => c.sortOrder), 0) - 1,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchCareers();
        resetForm();
        alert(
          editingId
            ? 'Career updated successfully!'
            : 'Career added successfully!',
        );
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving career:', error);
      alert('Error saving career');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (career: Career) => {
    setEditingId(career.id);
    setFormData(career);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this career entry?')) return;

    try {
      const response = await fetch(`/api/cms/careers?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCareers();
        alert('Career deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting career:', error);
      alert('Error deleting career');
    }
  };

  const handleHardDelete = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this career entry? This action cannot be undone.',
      )
    )
      return;

    try {
      const response = await fetch(`/api/cms/careers?id=${id}&hard=true`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCareers();
        alert('Career permanently deleted!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error hard deleting career:', error);
      alert('Error permanently deleting career');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      position: '',
      company: '',
      company_legal_name: '',
      logo: '',
      location: '',
      location_type: '',
      type: '',
      start_date: '',
      end_date: '',
      industry: '',
      link: '',
      responsibilities: [],
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
        <h2 className='text-xl font-semibold'>Career Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-green-600 hover:bg-green-700'
        >
          Add New Career
        </Button>
      </div>

      {showForm && (
        <Card className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Position *
                </label>
                <input
                  type='text'
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Company *
                </label>
                <input
                  type='text'
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Company Legal Name
                </label>
                <input
                  type='text'
                  value={formData.company_legal_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      company_legal_name: e.target.value,
                    })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
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
                <label className='mb-1 block text-sm font-medium'>
                  Location *
                </label>
                <input
                  type='text'
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Location Type
                </label>
                <select
                  value={formData.location_type}
                  onChange={(e) =>
                    setFormData({ ...formData, location_type: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                >
                  <option value=''>Select type</option>
                  <option value='Remote'>Remote</option>
                  <option value='On-site'>On-site</option>
                  <option value='Hybrid'>Hybrid</option>
                </select>
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Employment Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                >
                  <option value=''>Select type</option>
                  <option value='Full-time'>Full-time</option>
                  <option value='Part-time'>Part-time</option>
                  <option value='Contract'>Contract</option>
                  <option value='Freelance'>Freelance</option>
                  <option value='Internship'>Internship</option>
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
                Responsibilities (JSON)
              </label>
              <textarea
                value={
                  Array.isArray(formData.responsibilities)
                    ? JSON.stringify(formData.responsibilities, null, 2)
                    : ''
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({ ...formData, responsibilities: parsed });
                  } catch {
                    setFormData({ ...formData, responsibilities: [] });
                  }
                }}
                className='h-32 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Enter responsibilities as JSON array, e.g., ["Responsibility 1", "Responsibility 2"]'
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
                    ? 'Update Career'
                    : 'Add Career'}
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

      {careers.length === 0 ? (
        <EmptyState message='No careers found. Add your first career entry to get started.' />
      ) : (
        <div className='space-y-4'>
          {careers.map((career) => (
            <Card key={career.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <h3 className='font-semibold'>{career.position}</h3>
                    {!career.isActive && (
                      <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {career.company}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {career.start_date} - {career.end_date || 'Present'} •{' '}
                    {career.location}
                  </p>
                  <p className='text-sm text-gray-500'>{career.type}</p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => handleEdit(career)}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(career.id)}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Delete
                  </Button>
                  {!career.isActive && (
                    <Button
                      onClick={() => handleHardDelete(career.id)}
                      className='bg-red-800 hover:bg-red-900'
                      title='Permanently delete this career entry'
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

export default CareerManager;
