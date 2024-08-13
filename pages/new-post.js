import { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css'; // 引入Quill的样式
import styles from '../styles/NewPost.module.css'; // 引入CSS模块

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
        <div className={styles.container}>
            <h1 className={styles.heading}>吹水入口</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>标题</label>
                    <input
                        type="text"
                        placeholder="文章标题"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>日期</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>标签 (逗号分隔)</label>
                    <input
                        type="text"
                        placeholder="Tags"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={`${styles.formGroup} ${styles.checkboxGroup}`}>
                    <label className={styles.label}>
                        <input
                            type="checkbox"
                            checked={draft}
                            onChange={(e) => setDraft(e.target.checked)}
                        /> 草稿
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>作者</label>
                    <input
                        type="text"
                        placeholder="文章作者"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className={styles.input}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>摘要</label>
                    <textarea
                        placeholder="摘要总结"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className={styles.textarea}
                    ></textarea>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>正文内容</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        placeholder="开始吹水..."
                        className={styles.reactQuill}
                    />
                </div>
                <button type="submit" className={styles.button}>发布</button>
            </form>
        </div>
    );
}