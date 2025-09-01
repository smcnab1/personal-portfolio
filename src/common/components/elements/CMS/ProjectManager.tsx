import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import EmptyState from '@/common/components/elements/EmptyState';
import Loading from '@/common/components/elements/Loading';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  linkDemo?: string;
  linkGithub?: string;
  stacks?: string;
  isShow: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    linkDemo: '',
    linkGithub: '',
    stacks: '',
    isShow: true,
    isFeatured: false,
    sortOrder: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/cms/projects');
      const data = await response.json();
      // Show all projects for management, sort by sortOrder (lowest first)
      const sortedProjects = data.sort(
        (a: Project, b: Project) => a.sortOrder - b.sortOrder,
      );
      setProjects(sortedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = '/api/cms/projects';

      // For new items, set sortOrder to be at the top (lowest number)
      const body = editingId
        ? { ...formData, id: editingId }
        : {
            ...formData,
            sortOrder: Math.min(...projects.map((p) => p.sortOrder), 0) - 1,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchProjects();
        resetForm();
        alert(
          editingId
            ? 'Project updated successfully!'
            : 'Project added successfully!',
        );
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/cms/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProjects();
        alert('Project deleted successfully!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  const handleHardDelete = async (id: string) => {
    if (
      !confirm(
        'Are you sure you want to permanently delete this project? This action cannot be undone.',
      )
    )
      return;

    try {
      const response = await fetch(`/api/cms/projects?id=${id}&hard=true`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchProjects();
        alert('Project permanently deleted!');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      console.error('Error hard deleting project:', error);
      alert('Error permanently deleting project');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      image: '',
      linkDemo: '',
      linkGithub: '',
      stacks: '',
      isShow: true,
      isFeatured: false,
      sortOrder: 0,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>Project Management</h2>
        <Button
          onClick={() => setShowForm(true)}
          className='bg-green-600 hover:bg-green-700'
        >
          Add New Project
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
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData({
                      ...formData,
                      title,
                      slug: generateSlug(title),
                    });
                  }}
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>Slug *</label>
                <input
                  type='text'
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  required
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Image URL
                </label>
                <input
                  type='url'
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Demo Link
                </label>
                <input
                  type='url'
                  value={formData.linkDemo}
                  onChange={(e) =>
                    setFormData({ ...formData, linkDemo: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  GitHub Link
                </label>
                <input
                  type='url'
                  value={formData.linkGithub}
                  onChange={(e) =>
                    setFormData({ ...formData, linkGithub: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                />
              </div>
              <div>
                <label className='mb-1 block text-sm font-medium'>
                  Tech Stacks (comma-separated)
                </label>
                <input
                  type='text'
                  value={formData.stacks}
                  onChange={(e) =>
                    setFormData({ ...formData, stacks: e.target.value })
                  }
                  className='w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                  placeholder='React, TypeScript, Tailwind CSS'
                />
              </div>
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className='h-32 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Describe your project...'
                required
              />
            </div>
            <div>
              <label className='mb-1 block text-sm font-medium'>
                Content (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className='h-48 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                placeholder='Add detailed content in Markdown format...'
              />
            </div>
            <div className='flex items-center space-x-4'>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.isShow}
                  onChange={(e) =>
                    setFormData({ ...formData, isShow: e.target.checked })
                  }
                  className='mr-2'
                />
                Show Project
              </label>
              <label className='flex items-center'>
                <input
                  type='checkbox'
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                  className='mr-2'
                />
                Featured Project
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
                    ? 'Update Project'
                    : 'Add Project'}
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

      {projects.length === 0 ? (
        <EmptyState message='No projects found. Add your first project to get started.' />
      ) : (
        <div className='space-y-4'>
          {projects.map((project) => (
            <Card key={project.id} className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2'>
                    <h3 className='font-semibold'>{project.title}</h3>
                    {project.isFeatured && (
                      <span className='rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'>
                        Featured
                      </span>
                    )}
                    {!project.isShow && (
                      <span className='rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200'>
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                    {project.description.substring(0, 100)}...
                  </p>
                  {project.stacks && (
                    <p className='mt-1 text-sm text-gray-500'>
                      Tech: {project.stacks}
                    </p>
                  )}
                </div>
                <div className='flex space-x-2'>
                  <Button
                    onClick={() => handleEdit(project)}
                    className='bg-blue-600 hover:bg-blue-700'
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(project.id)}
                    className='bg-red-600 hover:bg-red-700'
                  >
                    Delete
                  </Button>
                  {!project.isShow && (
                    <Button
                      onClick={() => handleHardDelete(project.id)}
                      className='bg-red-800 hover:bg-red-900'
                      title='Permanently delete this project'
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

export default ProjectManager;
