import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import EmptyState from '@/common/components/elements/EmptyState';
import Loading from '@/common/components/elements/Loading';

interface Education {
  id: number;
  degree: string;
  school: string;
  major?: string;
  logo?: string;
  location?: string;
  startYear: number;
  endYear?: number;
  link?: string;
  isActive: boolean;
  sortOrder: number;
}

const EducationManager = () => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Education>>({
    degree: '',
    school: '',
    major: '',
    logo: '',
    location: '',
    startYear: new Date().getFullYear(),
    endYear: undefined,
    link: '',
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchEducations();
  }, []);

  const fetchEducations = async () => {
    try {
      const response = await fetch('/api/cms/education');
      const data = await response.json();
      // Show all educations for management, sort by start_year (newest first), then by sortOrder
      const sortedEducations = data.sort((a: Education, b: Education) => {
        if (a.startYear > b.startYear) return -1;
        if (a.startYear < b.startYear) return 1;
        return a.sortOrder - b.sortOrder;
      });
      setEducations(sortedEducations);
    } catch (error) {
      console.error('Error fetching educations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/cms/education';

      // For new items, set sortOrder to be at the top (lowest number)
      const body = editingId
        ? { ...formData, id: editingId }
        : {
            ...formData,
            sortOrder: Math.min(...educations.map((e) => e.sortOrder), 0) - 1,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchEducations();
        resetForm();
        alert(
          editingId
            ? 'Education updated successfully!'
            : 'Education added successfully!',
        );
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving education:', error);
      alert('Error saving education');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (education: Education) => {
    setEditingId(education.id);
    setFormData(education);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this education entry?'))
      return;

    try {
      const response = await fetch(`/api/cms/education?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEducations();
        alert('Education deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      alert('Error deleting education');
    }
  };

  const handleHardDelete = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this education entry? This action cannot be undone.',
      )
    )
      return;

    try {
      const response = await fetch(`/api/cms/education?id=${id}&hard=true`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchEducations();
        alert('Education permanently deleted!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error hard deleting education:', error);
      alert('Error permanently deleting education');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      degree: '',
      school: '',
      major: '',
      logo: '',
      location: '',
      startYear: new Date().getFullYear(),
      endYear: undefined,
      link: '',
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
        <h2 className='text-xl font-semibold'>Education Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-green-600 hover:bg-green-700'
        >
          Add New Education
        </Button>
      </div>

      {showForm && (
        <Card className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Degree *
                </label>
                <input
                  type='text'
                  value={formData.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, degree: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  School *
                </label>
                <input
                  type='text'
                  value={formData.school}
                  onChange={(e) =>
                    setFormData({ ...formData, school: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>Major</label>
                <input
                  type='text'
                  value={formData.major}
                  onChange={(e) =>
                    setFormData({ ...formData, major: e.target.value })
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
                  Location
                </label>
                <input
                  type='text'
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Start Year *
                </label>
                <input
                  type='number'
                  value={formData.startYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      startYear:
                        parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  min='1900'
                  max='2100'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  End Year
                </label>
                <input
                  type='number'
                  value={formData.endYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      endYear: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  min='1900'
                  max='2100'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  School Website
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
                    ? 'Update Education'
                    : 'Add Education'}
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

      {educations.length === 0 ? (
        <EmptyState message='No education entries found. Add your first education entry to get started.' />
      ) : (
        <div className='space-y-4'>
          {educations.map((education) => (
            <Card key={education.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <h3 className='font-semibold'>{education.degree}</h3>
                    {!education.isActive && (
                      <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {education.school}
                  </p>
                  {education.major && (
                    <p className='text-sm text-gray-500'>{education.major}</p>
                  )}
                  <p className='text-sm text-gray-500'>
                    {education.startYear} - {education.endYear || 'Present'}
                    {education.location && ` • ${education.location}`}
                  </p>
                </div>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => handleEdit(education)}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(education.id)}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Delete
                  </Button>
                  {!education.isActive && (
                    <Button
                      onClick={() => handleHardDelete(education.id)}
                      className='bg-red-800 hover:bg-red-900'
                      title='Permanently delete this education entry'
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

export default EducationManager;
