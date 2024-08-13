import { useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css'; // 引入Markdown编辑器样式
import styles from '../styles/NewPost.module.css'; // 引入CSS模块
import MarkdownIt from 'markdown-it';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), { ssr: false });
const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function NewPost() {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [tags, setTags] = useState('');
    const [draft, setDraft] = useState(false);
    const [author, setAuthor] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);

    const correctPassword = '043001'; // 设置你想要的密码

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === correctPassword) {
            setIsAuthorized(true);
        } else {
            alert('密码错误，请重试！');
        }
    };

    const handleEditorChange = ({ html, text }) => {
        setContent(text);
    };

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
        <>
            {!isAuthorized ? (
                <div className={styles.passwordContainer}>
                    <div className={styles.passwordBox}>
                        <h2>请输入访问密码</h2>
                        <form onSubmit={handlePasswordSubmit}>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.passwordInput}
                                placeholder="输入密码"
                            />
                            <button type="submit" className={styles.passwordButton}>
                                确认
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className={styles.container}>
                    <h1 className={styles.heading}>莱论发布器</h1>
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>标题</label>
                            <input
                                type="text"
                                placeholder="输入标题"
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
                                /> Draft
                            </label>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>作者</label>
                            <input
                                type="text"
                                placeholder="莱大"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>摘要</label>
                            <textarea
                                placeholder="莱摘..."
                                value={summary}
                                onChange={(e) => setSummary(e.target.value)}
                                className={styles.textarea}
                            ></textarea>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>正文内容</label>
                            <MdEditor
                                value={content}
                                style={{ height: "500px" }}
                                renderHTML={(text) => mdParser.render(text)}
                                onChange={handleEditorChange}
                            />
                        </div>
                        <button type="submit" className={styles.button}>莱论发射</button>
                    </form>
                </div>
            )}
        </>
    );
}