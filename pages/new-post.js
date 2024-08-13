import { useState } from 'react';
import axios from 'axios';

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [tags, setTags] = useState('');
    const [draft, setDraft] = useState(false);
    const [author, setAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const tagsArray = tags.split(',').map(tag => tag.trim());
        
        const response = await axios.post('/api/create-post', {
            title,
            date,
            tags: tagsArray,
            draft,
            author,
            summary,
            content,
        });

        if (response.status === 200) {
            alert('Post created successfully!');
        } else {
            alert('Failed to create post.');
        }
    };

    return (
        <div>
            <h1>Create New Post</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
                <input
                    type="checkbox"
                    checked={draft}
                    onChange={(e) => setDraft(e.target.checked)}
                /> Draft
                <input
                    type="text"
                    placeholder="Author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />
                <textarea
                    placeholder="Summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                ></textarea>
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button type="submit">Create Post</button>
            </form>
        </div>
    );
}