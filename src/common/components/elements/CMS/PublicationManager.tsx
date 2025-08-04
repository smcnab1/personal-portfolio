import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import EmptyState from '@/common/components/elements/EmptyState';
import Loading from '@/common/components/elements/Loading';

interface Publication {
  id: number;
  title: string;
  journal: string;
  logo?: string;
  location?: string;
  location_type?: string;
  type: string;
  start_date: string;
  link?: string;
  overview: string[];
  isActive: boolean;
  sortOrder: number;
}

const PublicationManager = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Publication>>({
    title: '',
    journal: '',
    logo: '',
    location: '',
    location_type: '',
    type: '',
    start_date: '',
    link: '',
    overview: [],
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/cms/publications');
      const data = await response.json();
      // Show all publications for management, sort by start_date (newest first), then by sortOrder
      const sortedPublications = data.sort((a: Publication, b: Publication) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        if (dateA > dateB) return -1;
        if (dateA < dateB) return 1;
        return a.sortOrder - b.sortOrder;
      });
      setPublications(sortedPublications);
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/cms/publications';

      // For new items, set sortOrder to be at the top (lowest number)
      const body = editingId
        ? { ...formData, id: editingId }
        : {
            ...formData,
            sortOrder: Math.min(...publications.map((p) => p.sortOrder), 0) - 1,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchPublications();
        resetForm();
        alert(
          editingId
            ? 'Publication updated successfully!'
            : 'Publication added successfully!',
        );
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving publication:', error);
      alert('Error saving publication');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (publication: Publication) => {
    setEditingId(publication.id);
    setFormData(publication);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this publication?')) return;

    try {
      const response = await fetch(`/api/cms/publications?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPublications();
        alert('Publication deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting publication:', error);
      alert('Error deleting publication');
    }
  };

  const handleHardDelete = async (id: number) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this publication? This action cannot be undone.',
      )
    )
      return;

    try {
      const response = await fetch(`/api/cms/publications?id=${id}&hard=true`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPublications();
        alert('Publication permanently deleted!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error hard deleting publication:', error);
      alert('Error permanently deleting publication');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: '',
      journal: '',
      logo: '',
      location: '',
      location_type: '',
      type: '',
      start_date: '',
      link: '',
      overview: [],
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
        <h2 className='text-xl font-semibold'>Publication Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-green-600 hover:bg-green-700'
        >
          Add New Publication
        </Button>
      </div>

      {showForm && (
        <Card className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Title *
                </label>
                <input
                  type='text'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Journal *
                </label>
                <input
                  type='text'
                  value={formData.journal}
                  onChange={(e) =>
                    setFormData({ ...formData, journal: e.target.value })
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
                  <option value='Online'>Online</option>
                  <option value='Print'>Print</option>
                  <option value='Conference'>Conference</option>
                </select>
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
                  <option value='Journal Article'>Journal Article</option>
                  <option value='Conference Paper'>Conference Paper</option>
                  <option value='Book Chapter'>Book Chapter</option>
                  <option value='Research Report'>Research Report</option>
                </select>
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Publication Date *
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
                  DOI/Website
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
                Overview (JSON)
              </label>
              <textarea
                value={
                  Array.isArray(formData.overview)
                    ? JSON.stringify(formData.overview, null, 2)
                    : ''
                }
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({ ...formData, overview: parsed });
                  } catch {
                    setFormData({ ...formData, overview: [] });
                  }
                }}
                className='h-32 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Enter overview as JSON array, e.g., ["Overview 1", "Overview 2"]'
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
                    ? 'Update Publication'
                    : 'Add Publication'}
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

      {publications.length === 0 ? (
        <EmptyState message='No publications found. Add your first publication to get started.' />
      ) : (
        <div className='space-y-4'>
          {publications.map((publication) => (
            <Card key={publication.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <h3 className='font-semibold'>{publication.title}</h3>
                    {!publication.isActive && (
                      <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {publication.journal}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {publication.start_date} • {publication.type}
                  </p>
                  {publication.location && (
                    <p className='text-sm text-gray-500'>
                      {publication.location}
                    </p>
                  )}
                </div>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => handleEdit(publication)}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(publication.id)}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Delete
                  </Button>
                  {!publication.isActive && (
                    <Button
                      onClick={() => handleHardDelete(publication.id)}
                      className='bg-red-800 hover:bg-red-900'
                      title='Permanently delete this publication'
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

export default PublicationManager;
