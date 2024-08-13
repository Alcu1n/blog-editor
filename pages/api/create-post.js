import axios from 'axios';

export default async function handler(req, res) {
    const { title, date, tags, draft, author, summary, content } = req.body;

    // 将标题转换为拼音或仅保留字母和数字
    const toPinyin = (str) => {
        return str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    };

    const fileName = toPinyin(title) + '.mdx';

    const fileContent = `---
title: '${title}'
date: '${date}'
tags: [${tags.map(tag => `'${tag}'`).join(', ')}]
draft: ${draft}
author: '${author}'
summary: '${summary}'
---

${content}
`;

    try {
        const response = await axios.put(
            `https://api.github.com/repos/${process.env.REPO_OWNER}/${process.env.REPO_NAME}/contents/${process.env.CONTENT_PATH}/${fileName}`,
            {
                message: `Add new blog post: ${title}`,
                content: Buffer.from(fileContent).toString('base64'),
            },
            {
                headers: {
                    Authorization: `token ${process.env.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error('Error creating post:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({ message: 'Failed to create post' });
    }
}