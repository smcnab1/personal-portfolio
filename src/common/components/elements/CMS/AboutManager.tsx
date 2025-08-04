import { useEffect, useState } from 'react';

import Button from '@/common/components/elements/Button';
import Card from '@/common/components/elements/Card';
import Loading from '@/common/components/elements/Loading';

interface AboutData {
  id: number;
  content: string;
}

const AboutManager = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/cms/about');
      const data = await response.json();

      if (data && data.length > 0) {
        setAboutData(data[0]);
        setContent(data[0].content);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = aboutData ? 'PUT' : 'POST';
      const url = '/api/cms/about';
      const body = aboutData ? { id: aboutData.id, content } : { content };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const savedData = await response.json();
        setAboutData(savedData);
        alert('About content saved successfully!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving about content');
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
        <h2 className='text-xl font-semibold'>About Content</h2>
        <Button
          onClick={handleSave}
          disabled={saving}
          className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card className='p-6'>
        <div className='space-y-4'>
          <div>
            <label className='mb-2 block text-sm font-medium'>
              About Content (HTML)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='h-96 w-full rounded-md border border-gray-300 p-4 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              placeholder='Enter your about content in HTML format...'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-medium'>Preview</label>
            <div className='rounded-md border border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800'>
              <div
                className='prose prose-sm dark:prose-invert max-w-none'
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutManager;
